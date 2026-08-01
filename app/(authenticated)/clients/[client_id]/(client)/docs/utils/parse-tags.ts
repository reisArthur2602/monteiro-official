export const MAX_TAGS = 8;
const MAX_TAG_LENGTH = 40;

/**
 * Converte a string livre do campo "Tags" (separada por vírgula) na lista
 * gravada no banco: aparadas, sem vazias, sem duplicadas e limitadas em
 * quantidade e tamanho para não virar um campo de texto livre disfarçado.
 */
export const parseTagsInput = (input: string): string[] => {
  const tags = input
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0 && tag.length <= MAX_TAG_LENGTH);

  return Array.from(new Set(tags)).slice(0, MAX_TAGS);
};
