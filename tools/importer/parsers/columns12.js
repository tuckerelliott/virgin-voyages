/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns12)'];

  // Get all immediate child divs (each represents a column)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each column div, find the button/link inside and use it as the cell content
  const cells = columnDivs.map((colDiv) => {
    // Find the anchor (button styled as link)
    const btn = colDiv.querySelector('a');
    // Defensive: fallback to the column div if anchor not found
    return btn || colDiv;
  });

  // Build the table rows
  const tableRows = [
    headerRow,
    cells
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
