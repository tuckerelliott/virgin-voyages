/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main flex row containing columns
  const flexRow = element.querySelector('.flex.flex-col-reverse.flex-wrap');
  if (!flexRow) return;
  const columnDivs = flexRow.children;
  if (columnDivs.length < 2) return;

  // --- Left Column: Textual Content ---
  const leftCol = columnDivs[0];
  const leftContent = leftCol.querySelector(':scope > div');
  if (!leftContent) return;

  // Extract 'Tier 1' label
  const tierLabel = leftContent.querySelector('div');
  // Extract headline
  const headline = leftContent.querySelector('h2');
  // Extract subheading
  const subheading = leftContent.querySelector('div > p');
  // Extract description (second p)
  const description = leftContent.querySelector('div > p + p');

  // Compose left cell content
  const leftCell = document.createElement('div');
  if (tierLabel) leftCell.appendChild(tierLabel);
  if (headline) leftCell.appendChild(headline);
  if (subheading) leftCell.appendChild(subheading);
  if (description) leftCell.appendChild(description);

  // --- Right Column: Image ---
  const rightCol = columnDivs[1];
  const img = rightCol.querySelector('img');
  const rightCell = document.createElement('div');
  if (img) rightCell.appendChild(img);

  // --- Table Construction ---
  const headerRow = ['Columns (columns5)'];
  const contentRow = [leftCell, rightCell];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
