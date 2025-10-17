/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns16)'];

  // Defensive: Get immediate children of the main flex row
  const flexRow = element.querySelector('.flex.flex-col-reverse.flex-wrap');
  if (!flexRow) return;
  const columns = Array.from(flexRow.children);
  if (columns.length < 2) return;

  // Left column: text content
  const leftCol = columns[0];
  // Right column: image content
  const rightCol = columns[1];

  // --- LEFT COLUMN ---
  // Find the main content wrapper inside leftCol
  const leftContent = leftCol.querySelector('div');
  // We'll gather all relevant children from leftContent
  const leftParts = [];

  // Small heading (first div)
  const smallHeading = leftContent.querySelector('div');
  if (smallHeading && smallHeading.textContent.trim()) {
    leftParts.push(smallHeading);
  }

  // Main headline (h2)
  const headline = leftContent.querySelector('h2');
  if (headline) leftParts.push(headline);

  // Paragraph and list content (pl-4 container)
  // Fix: Use [class*="pl-"] to match any class containing 'pl-'
  const pl4 = leftContent.querySelector('div[class*="pl-"]');
  if (pl4) {
    // Get all children except empty paragraphs
    Array.from(pl4.children).forEach(child => {
      if (child.tagName === 'P' && !child.textContent.trim()) return;
      leftParts.push(child);
    });
  }

  // CTA button (look for <a> with class containing 'book')
  const cta = leftContent.querySelector('a[href][class*="book"]');
  if (cta) leftParts.push(cta);

  // --- RIGHT COLUMN ---
  // Find the image inside rightCol
  let image = null;
  const imgWrap = rightCol.querySelector('img');
  if (imgWrap) image = imgWrap;

  // --- TABLE CONSTRUCTION ---
  // The second row: left column (all leftParts), right column (image)
  const secondRow = [leftParts, image ? [image] : []];

  // Create and replace block
  const cells = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
