// Checks if a string from the quill editor has any real texts content or if it is all html tags
export function containsActualText(htmlContent: string) {
  if (!htmlContent) htmlContent = "";
  const strippedText = htmlContent.replace(/<[^>]*>/g, "").trim();
  return strippedText.length > 0;
}

export const validateUnorderedListOnly = (content: string): boolean => {
  if (!content) return false;

  console.log({ content });

  // Trim whitespace and check if it's only a <ul> with <li> elements inside
  const ulRegex = /^<ul>(<li>.*?<\/li>)+<\/ul>$/;

  return ulRegex.test(content.trim());
};
