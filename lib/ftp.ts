import "server-only";

import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import { Readable, Writable } from "node:stream";

import { Client } from "basic-ftp";

import { env } from "./env";
import {
  ALLOWED_EXTENSIONS as ALLOWED_EXTENSION_LIST,
  ALLOWED_MIME_TYPES as ALLOWED_MIME_TYPE_LIST,
  MAX_UPLOAD_BYTES,
} from "./ftp-limits";

const ALLOWED_EXTENSIONS = new Set<string>(ALLOWED_EXTENSION_LIST);
const ALLOWED_MIME_TYPES = new Set<string>(ALLOWED_MIME_TYPE_LIST);

export type FtpValidationError =
  | "EXTENSION_NOT_ALLOWED"
  | "MIME_NOT_ALLOWED"
  | "FILE_TOO_LARGE"
  | "EMPTY_FILE";

export class FtpValidationException extends Error {
  constructor(readonly code: FtpValidationError) {
    super(code);
    this.name = "FtpValidationException";
  }
}

/**
 * Normaliza a extensão vinda do nome original. Só a extensão é aproveitada
 * do que o cliente enviou; o restante do nome nunca vira caminho.
 */
const normalizeExtension = (originalName: string) => {
  const extension = extname(originalName).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new FtpValidationException("EXTENSION_NOT_ALLOWED");
  }

  return extension;
};

export const assertUploadIsAllowed = (file: {
  name: string;
  type: string;
  size: number;
}) => {
  if (file.size <= 0) {
    throw new FtpValidationException("EMPTY_FILE");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new FtpValidationException("FILE_TOO_LARGE");
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new FtpValidationException("MIME_NOT_ALLOWED");
  }

  return normalizeExtension(file.name);
};

/**
 * Chave de storage derivada apenas de valores gerados no servidor.
 * O nome original do cliente nunca compõe o caminho, então não há
 * como um `../` ou um nome absoluto escapar do diretório do cliente.
 */
export const buildStorageKey = (clientId: string, extension: string) =>
  `clients/${clientId}/${randomUUID()}${extension}`;

/**
 * Recusa qualquer chave que não tenha o formato que `buildStorageKey`
 * produz. Protege a leitura e a remoção contra path traversal caso uma
 * chave adulterada chegue ao banco.
 */
const assertStorageKeyIsSafe = (storageKey: string) => {
  const isSafe = /^clients\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.[a-z0-9]{2,5}$/i.test(
    storageKey,
  );

  if (!isSafe) {
    throw new Error("INVALID_STORAGE_KEY");
  }
};

const createClient = async () => {
  const client = new Client(30_000);

  await client.access({
    host: env.FTP_HOST,
    port: env.FTP_PORT,
    user: env.FTP_USER,
    password: env.FTP_PASSWORD,
    secure: env.FTP_SECURE,
    secureOptions: {
      rejectUnauthorized: env.FTP_REJECT_UNAUTHORIZED,
    },
  });

  return client;
};

/**
 * Abre a conexão, executa a operação e fecha sempre — inclusive em erro,
 * para não deixar sockets pendurados no servidor FTP.
 */
const withFtp = async <T>(operation: (client: Client) => Promise<T>) => {
  const client = await createClient();

  try {
    return await operation(client);
  } finally {
    client.close();
  }
};

const resolveRemotePath = (storageKey: string) =>
  `${env.FTP_BASE_DIR.replace(/\/+$/, "")}/${storageKey}`;

/**
 * Grava o arquivo e devolve a chave gerada. `ensureDir` cria a árvore do
 * cliente na primeira gravação e deixa o cwd no diretório criado, por isso
 * o upload usa só o nome do arquivo em seguida.
 */
export const uploadToFtp = async (input: {
  clientId: string;
  extension: string;
  body: Buffer;
}) => {
  const storageKey = buildStorageKey(input.clientId, input.extension);
  const remotePath = resolveRemotePath(storageKey);
  const directory = remotePath.slice(0, remotePath.lastIndexOf("/"));
  const fileName = remotePath.slice(remotePath.lastIndexOf("/") + 1);

  await withFtp(async (client) => {
    await client.ensureDir(directory);
    await client.uploadFrom(Readable.from(input.body), fileName);
  });

  return storageKey;
};

/**
 * Remove o arquivo do FTP. A exclusão de documento é lógica e mantém o
 * arquivo no servidor — isto existe só para desfazer um upload cujo
 * registro no banco falhou, evitando arquivo órfão.
 */
export const removeFromFtp = async (storageKey: string) => {
  assertStorageKeyIsSafe(storageKey);

  await withFtp((client) => client.remove(resolveRemotePath(storageKey)));
};

/**
 * Baixa o arquivo inteiro para memória. Os limites de upload mantêm o
 * tamanho previsível, e o buffer evita manter a conexão FTP aberta
 * enquanto a resposta HTTP é consumida pelo navegador.
 */
export const downloadFromFtp = async (storageKey: string) => {
  assertStorageKeyIsSafe(storageKey);

  return withFtp(async (client) => {
    const chunks: Buffer[] = [];

    const writable = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk));
        callback();
      },
    });

    await client.downloadTo(writable, resolveRemotePath(storageKey));

    return Buffer.concat(chunks);
  });
};
