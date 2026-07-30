import { generateHTML } from "@tiptap/html/server";

import { legalEditorExtensions } from "../editor/legal-editor-extensions";

/**
 * Converte o JSON do editor em HTML **no servidor**.
 *
 * Esta função é a fronteira de sanitização do documento. O HTML enviado
 * pelo navegador é sempre descartado: só o JSON viaja, e ele passa pelo
 * schema do ProseMirror, que rejeita nós desconhecidos e descarta
 * atributos fora dos declarados nas extensões. Como o editor não registra
 * script, iframe, imagem, link, estilo, classe ou cor, nada disso
 * sobrevive à conversão.
 *
 * Lança quando o JSON não corresponde ao schema — a action trata isso
 * como entrada inválida.
 */
export const renderDocumentHtml = (contentJson: Record<string, unknown>) =>
  generateHTML(contentJson, legalEditorExtensions);
