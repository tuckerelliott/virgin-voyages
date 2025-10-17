/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion18)'];

  // Find all accordion items (divs with class 'Accordion')
  const accordionItems = Array.from(element.querySelectorAll('.Accordion'));

  // Build rows for each accordion item
  const rows = accordionItems.map((item) => {
    // Title cell: find the clickable header (role="button") and extract the question span
    const headerButton = item.querySelector('[role="button"]');
    let titleCell;
    if (headerButton) {
      // Use the question span inside the button for the title
      const questionSpan = headerButton.querySelector('.Accordion__question');
      titleCell = questionSpan ? questionSpan : headerButton;
    } else {
      // Fallback: use the header text
      const h3 = item.querySelector('h3');
      titleCell = h3 ? h3 : document.createTextNode('');
    }

    // Content cell: find the answer content
    const answerContent = item.querySelector('.Accordion__answer-content');
    let contentCell;
    if (answerContent) {
      // If answerContent contains only text, use it directly
      if (answerContent.children.length === 0) {
        contentCell = document.createTextNode(answerContent.textContent.trim());
      } else {
        // If answerContent contains elements, use them all
        contentCell = Array.from(answerContent.childNodes);
      }
    } else {
      // Fallback: use empty cell
      contentCell = document.createTextNode('');
    }

    return [titleCell, contentCell];
  });

  // Compose the table rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
