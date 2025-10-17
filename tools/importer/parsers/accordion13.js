/* global WebImporter */
export default function parse(element, { document }) {
  // Find all Accordion items within the section
  const accordionItems = Array.from(element.querySelectorAll('.Accordion'));

  // Accordion block header row (must match spec)
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  accordionItems.forEach(item => {
    // Title cell: find the interactive header button/span
    const headerBtn = item.querySelector('[role="button"]');
    let titleCell;
    if (headerBtn) {
      // Only use the question span for the title, remove icons
      const questionSpan = headerBtn.querySelector('.Accordion__question');
      if (questionSpan) {
        // Use only the plain text content for the title cell
        titleCell = questionSpan.textContent.trim();
      } else {
        // Fallback: use headerBtn text
        titleCell = headerBtn.textContent.trim();
      }
    } else {
      // If no headerBtn, skip this item
      return;
    }

    // Content cell: answer content div
    const answerContent = item.querySelector('.Accordion__answer-content');
    let contentCell;
    if (answerContent) {
      // Reference the actual element (do not clone)
      contentCell = answerContent;
    } else {
      // If no content, skip this item
      return;
    }

    // Add row to table
    rows.push([titleCell, contentCell]);
  });

  // Create the table using WebImporter utility
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
