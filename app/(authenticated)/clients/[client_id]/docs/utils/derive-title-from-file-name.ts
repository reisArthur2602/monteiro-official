/** Nome do arquivo sem extensão, usado como título quando o campo fica em branco. */
export const deriveTitleFromFileName = (fileName: string) => {
  const withoutExtension = fileName.replace(/\.[^./\\]+$/, "");

  return (withoutExtension || fileName).slice(0, 200);
};
