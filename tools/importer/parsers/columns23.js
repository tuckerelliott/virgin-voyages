/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns23)'];

  // Find the main container holding the columns (cards)
  // The first direct child div of the section is the flex container
  const flexContainer = element.querySelector(':scope > div');
  if (!flexContainer) return;

  // Each column is a direct child div of the flex container
  const columnDivs = Array.from(flexContainer.children).filter(child => child.tagName === 'DIV');

  // For each column, gather its content (icon, heading, text)
  const columns = columnDivs.map(col => {
    // The icon/image is the first div, the content is the second div
    const iconDiv = col.querySelector(':scope > div');
    const contentDiv = col.querySelector(':scope > div + div');

    // Gather all content for the column
    const columnContent = [];
    if (iconDiv) {
      const img = iconDiv.querySelector('img');
      if (img) columnContent.push(img);
    }
    if (contentDiv) {
      // Only push non-empty elements
      Array.from(contentDiv.children).forEach(child => {
        // Remove empty <h3> (sometimes present)
        if (child.tagName === 'H3' && !child.textContent.trim()) return;
        columnContent.push(child);
      });
    }
    return columnContent;
  });

  // Build the table rows
  const rows = [
    headerRow,
    columns
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
