/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards27) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards27)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  // In this HTML, it's the first div inside the section
  const cardsContainer = element.querySelector('div');
  if (!cardsContainer) return;

  // Each card is a direct child div of the cardsContainer
  const cardDivs = Array.from(cardsContainer.children).filter(child => child.tagName === 'DIV');

  cardDivs.forEach(card => {
    // Image: first div contains the image
    const imgWrapper = card.querySelector('div');
    const img = imgWrapper ? imgWrapper.querySelector('img') : null;
    // Text: second div contains heading and paragraph
    const textWrapper = card.querySelector('div + div');
    let textElements = [];
    if (textWrapper) {
      // Heading
      const heading = textWrapper.querySelector('h3');
      if (heading) textElements.push(heading);
      // Paragraph
      const para = textWrapper.querySelector('p');
      if (para) textElements.push(para);
    }
    // Add the card row: [image, text content]
    rows.push([
      img ? img : '',
      textElements.length ? textElements : ''
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(block);
}
