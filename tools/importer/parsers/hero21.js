/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Hero (hero21)
  const headerRow = ['Hero (hero21)'];

  // --- Extract background image ---
  // Find the <img> inside <picture> within Multimedia
  let bgImg = null;
  const imgEl = element.querySelector('picture img');
  if (imgEl) {
    bgImg = imgEl;
  }

  // --- Extract text content (heading, subheading, CTA) ---
  // Find the main content wrapper
  let heading = null;
  let subheading = null;
  let cta = null;

  // The heading is <h1>, subheading is <p>, CTA is not present in this example
  const contentCol = element.querySelector('.HeroV30__content, .OneColumnWrapper, .flex.flex-col');
  // Defensive: fallback to searching for h1 and p
  heading = element.querySelector('h1');
  subheading = element.querySelector('p');

  // Find CTA (anchor) if present inside the content area
  // For this example, there is no CTA, but code supports it
  if (contentCol) {
    cta = contentCol.querySelector('a');
  } else {
    cta = element.querySelector('a');
  }

  // Compose the text content cell
  const textCellContent = [];
  if (heading) textCellContent.push(heading);
  if (subheading) textCellContent.push(subheading);
  if (cta) textCellContent.push(cta);

  // --- Build table rows ---
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [textCellContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
