/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row: block name
  const headerRow = ['Hero (hero6)'];

  // 2. Background image row: find the main image
  let imageEl = null;
  const picture = element.querySelector('picture');
  if (picture) {
    imageEl = picture.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Content row: leave empty since there is no heading, subheading, or CTA in the HTML or screenshot
  const contentRow = [''];

  // 4. Assemble table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // 5. Replace the original element with the new table
  element.replaceWith(table);
}
