/**
 * Shared utility functions for text formatting and manipulation
 */

// Citations: text -> url mappings
const citations = [
  { text: 'Shevlane et al., 2023', url: 'https://arxiv.org/abs/2305.15324' },
  { text: 'Shevlane et al. (2023)', url: 'https://arxiv.org/abs/2305.15324' },
  { text: '(OpenAI, 2024)', url: 'https://arxiv.org/abs/2412.16720' },
  { text: '(METR, 2025)', url: 'https://metr.org/blog/2025-07-14-how-does-time-horizon-vary-across-domains/' },
  { text: '(Adalja, 2019)', url: 'https://centerforhealthsecurity.org/sites/default/files/2022-12/180510-pandemic-pathogens-report.pdf' },
];

/**
 * Escape regex special characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Convert text with citations and markdown links to HTML with clickable links.
 *
 * Handles two types of links:
 * 1. Markdown-style links: [text](url) -> <a href="url">text</a>
 * 2. Known citations: matches text from the citations array and converts to links
 *
 * All links open in a new tab with security attributes (target="_blank" rel="noopener noreferrer")
 *
 * @param text - The text to process
 * @returns HTML string with links converted to anchor tags
 */
export function linkifyCitations(text: string): string {
  let result = text;

  // First, convert markdown-style links [text](url) to HTML anchors
  result = result.replace(
    /\[([^\]]+)\]\(([^\)]+)\)/g,
    (match, linkText, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    }
  );

  // Then, replace known citations with links
  citations.forEach(({ text: citationText, url }) => {
    const pattern = new RegExp(escapeRegex(citationText), 'g');
    result = result.replace(
      pattern,
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${citationText}</a>`
    );
  });

  return result;
}
