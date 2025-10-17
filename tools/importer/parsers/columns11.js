/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Columns block
  const headerRow = ['Columns (columns11)'];

  // Find the main flex container that holds both columns
  const mainFlex = element.querySelector('div.flex');
  let leftCol, rightCol;
  if (mainFlex && mainFlex.children.length === 2) {
    // Left column: text, Right column: image
    leftCol = mainFlex.children[0];
    rightCol = mainFlex.children[1];
  } else {
    // Fallback: try to find two largest children
    const candidates = Array.from(element.querySelectorAll(':scope > div > div > div'));
    [leftCol, rightCol] = candidates;
  }

  // --- LEFT COLUMN CONTENT ---
  let leftContent = leftCol;
  if (leftCol) {
    // Find the deepest content wrapper
    const inner = leftCol.querySelector(':scope > div');
    if (inner) leftContent = inner;
  }

  // --- RIGHT COLUMN CONTENT ---
  let rightContent = rightCol;
  if (rightCol) {
    // Find the image element
    const img = rightCol.querySelector('img');
    if (img) {
      rightContent = img;
    }
  }

  // Compose the table rows
  const tableRows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
