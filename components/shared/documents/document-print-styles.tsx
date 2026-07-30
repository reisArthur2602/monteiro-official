import "./legal-document.css";

/**
 * Ponto único de importação da folha de estilo do documento.
 *
 * Qualquer tela que renderize um `LegalDocumentFrame` monta este
 * componente uma vez. Ele não desenha nada — existe para que o CSS de
 * documento e de impressão entre no bundle da rota sem que cada
 * componente precise importar o arquivo.
 */
export const DocumentPrintStyles = () => null;
