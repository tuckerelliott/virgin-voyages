/* global WebImporter */
export default function parse(element, { document }) {
  // Find main flex container for columns
  const flexContainer = element.querySelector('.flex.flex-col-reverse.flex-wrap');
  if (!flexContainer) return;
  const columns = Array.from(flexContainer.children);
  if (columns.length < 2) return;

  // LEFT COLUMN: Extract all meaningful content in order, as elements, including ALL text
  const leftCol = columns[0];
  const leftContent = [];
  // Find the main wrapper for left column content
  const leftWrapper = leftCol.querySelector('div > div');
  if (leftWrapper) {
    // Find the small uppercase heading (section label)
    const sectionLabel = leftWrapper.querySelector('div.font-bold.uppercase');
    if (sectionLabel) leftContent.push(sectionLabel.cloneNode(true));
    // Find the main heading (h2)
    const mainHeading = leftWrapper.querySelector('h2');
    if (mainHeading) leftContent.push(mainHeading.cloneNode(true));
    // Get all direct children (headings, paragraphs, CTA, etc.)
    Array.from(leftWrapper.children).forEach(child => {
      // For the block that contains paragraphs and CTA, get its children
      if (child.matches('div')) {
        Array.from(child.children).forEach(grandChild => {
          if (grandChild.matches('p, a, div')) {
            leftContent.push(grandChild.cloneNode(true));
          }
        });
      }
    });
  }

  // RIGHT COLUMN: Extract all images in order
  const rightCol = columns[1];
  const rightContent = [];
  const imgs = rightCol.querySelectorAll('img');
  imgs.forEach(img => {
    rightContent.push(img.cloneNode(true));
  });

  // Table header must match block name exactly
  const headerRow = ['Columns (columns24)'];
  // Table row: left column (text), right column (images)
  const contentRow = [leftContent, rightContent];

  // Create table with correct structure
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
