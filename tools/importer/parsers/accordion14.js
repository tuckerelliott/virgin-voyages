/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion14) block parsing
  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // Find all accordion containers (could be multiple accordions per section)
  const accordions = element.querySelectorAll('.Accordion');

  accordions.forEach((accordion) => {
    // Find the header/title (usually a button or element with role="button")
    const headerBtn = accordion.querySelector('[role="button"]');
    let titleCell = '';
    if (headerBtn) {
      // Only use the plain text of the question, not the HTML element
      const question = headerBtn.querySelector('.Accordion__question');
      if (question) {
        titleCell = question.textContent.trim();
      } else {
        titleCell = headerBtn.textContent.trim();
      }
    } else {
      // Fallback: use the first heading or text
      const h = accordion.querySelector('h3, h2, h1');
      titleCell = h ? h.textContent.trim() : '';
    }

    // Extract the full answer/content for the accordion body
    let contentCell = '';
    const answerContent = accordion.querySelector('.Accordion__answer-content');
    if (answerContent) {
      contentCell = answerContent;
    } else {
      // Fallback: use the answer container
      const answerDiv = accordion.querySelector('.Accordion__answer');
      contentCell = answerDiv ? answerDiv : '';
    }

    rows.push([titleCell, contentCell]);
  });

  // Build the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
