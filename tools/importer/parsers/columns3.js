/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns container by class containing 'flex' and 'flex-row'
  // Use less specific selector to avoid pseudo-class issues
  const mainRow = Array.from(element.querySelectorAll('div'))
    .find(div => div.className && div.className.includes('flex') && div.className.includes('flex-row'));
  if (!mainRow) return;

  // Get the two direct child columns
  const columns = mainRow.children;
  if (columns.length < 2) return;

  // --- LEFT COLUMN: Extract content ---
  const leftCol = columns[0];
  // Find the deepest div with content
  let leftInner = leftCol;
  // Traverse down to the content wrapper
  while (leftInner && leftInner.children.length === 1 && leftInner.firstElementChild.tagName === 'DIV') {
    leftInner = leftInner.firstElementChild;
  }

  // Extract the heading (small label)
  const label = leftInner.querySelector('div.font-bold.uppercase, div.uppercase');
  // Extract the main heading (h2)
  const heading = leftInner.querySelector('h2');
  // Extract the main paragraph
  const paragraph = leftInner.querySelector('p');
  // Extract CTA link (if present)
  const cta = leftInner.querySelector('a');

  // Build a fragment for the left cell
  const leftCell = document.createElement('div');
  if (label) leftCell.appendChild(label.cloneNode(true));
  if (heading) leftCell.appendChild(heading.cloneNode(true));
  if (paragraph) leftCell.appendChild(paragraph.cloneNode(true));
  if (cta) leftCell.appendChild(cta.cloneNode(true));

  // --- RIGHT COLUMN: Extract image ---
  const rightCol = columns[1];
  // Find the first image in the rightCol
  const img = rightCol.querySelector('img');
  let rightCell;
  if (img) {
    rightCell = img;
  } else {
    rightCell = rightCol;
  }

  // --- TABLE CONSTRUCTION ---
  const headerRow = ['Columns (columns3)'];
  const contentRow = [leftCell, rightCell];
  const rows = [headerRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
