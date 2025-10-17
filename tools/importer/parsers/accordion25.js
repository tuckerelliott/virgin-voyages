/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion25)'];

  // Find all accordion items (divs with class Accordion)
  const accordionItems = Array.from(element.querySelectorAll('.Accordion'));

  // Build rows: [title cell, content cell]
  const rows = accordionItems.map(item => {
    // Title cell: find the header button (role="button") and get its question span
    const headerBtn = item.querySelector('[role="button"]');
    let titleEl = null;
    if (headerBtn) {
      // The question is inside a span with class Accordion__question
      titleEl = headerBtn.querySelector('.Accordion__question');
      // Defensive fallback: if not found, use the button itself
      if (!titleEl) titleEl = headerBtn;
    } else {
      // Fallback: try to find h3 or first heading
      titleEl = item.querySelector('h3, h2, h1');
    }

    // Content cell: find the answer content
    let contentEl = item.querySelector('.Accordion__answer-content');
    // Defensive fallback: if not found, try the answer div
    if (!contentEl) contentEl = item.querySelector('.Accordion__answer');
    // As a last resort, use the whole item
    if (!contentEl) contentEl = item;

    return [titleEl, contentEl];
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
