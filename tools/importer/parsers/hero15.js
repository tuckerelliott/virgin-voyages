/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero15)'];

  // 2. Background image row
  // Look for the first <img> in the section (background image)
  const bgImg = element.querySelector('img');
  const bgImgRow = [bgImg ? bgImg : ''];

  // 3. Content row: heading, subheading (if any), CTA (if any)
  // Find the main headline (h2)
  let contentElements = [];
  const h2 = element.querySelector('h2');
  if (h2) contentElements.push(h2);

  // Find the form (contains dropdowns and CTA)
  const form = element.querySelector('form');
  if (form) contentElements.push(form);

  // Compose the content row
  const contentRow = [contentElements];

  // 4. Build the table
  const cells = [
    headerRow,
    bgImgRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace the original element
  element.replaceWith(table);
}
