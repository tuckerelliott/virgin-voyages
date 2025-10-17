/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all accordion items
  const accordionItems = Array.from(element.querySelectorAll('.Accordion'));

  // Build rows: header first, then each accordion item as [title, content]
  const rows = [];
  // Always use the required block name as the header
  rows.push(['Accordion (accordion26)']);

  accordionItems.forEach((item) => {
    // Title cell: find the clickable header (role="button") and get the question span
    const headerBtn = item.querySelector('[role="button"]');
    let titleContent = '';
    if (headerBtn) {
      // Use the question span if present, else fallback to textContent
      const questionSpan = headerBtn.querySelector('.Accordion__question');
      if (questionSpan) {
        titleContent = questionSpan.cloneNode(true);
      } else {
        // fallback: use the button's text
        titleContent = document.createTextNode(headerBtn.textContent.trim());
      }
    }
    // Content cell: find the answer content
    let contentCell = '';
    const answerContent = item.querySelector('.Accordion__answer-content');
    if (answerContent) {
      // Use the whole answer content element (preserving markup)
      contentCell = answerContent.cloneNode(true);
    }
    rows.push([titleContent, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
