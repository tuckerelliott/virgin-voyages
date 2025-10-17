/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards20) block
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  // In this HTML, it's the first div inside the section
  const cardsContainer = element.querySelector('div');
  if (!cardsContainer) return;

  // Each card is a direct child div of the container
  const cardDivs = Array.from(cardsContainer.children).filter(child => child.tagName === 'DIV');

  cardDivs.forEach(card => {
    // Image/Icon: always the first child div, contains the img
    const imageDiv = card.querySelector('div');
    const img = imageDiv ? imageDiv.querySelector('img') : null;

    // Text content: second child div, contains h3 and p
    const textDivs = Array.from(card.children).filter(c => c !== imageDiv);
    let textDiv = textDivs.length ? textDivs[0] : null;
    if (!textDiv) {
      // fallback: try to find h3 or p
      textDiv = card.querySelector('h3, p')?.parentElement;
    }

    // Compose the text cell: include h3 and p if present
    let textCell = [];
    if (textDiv) {
      const h3 = textDiv.querySelector('h3');
      const p = textDiv.querySelector('p');
      if (h3) textCell.push(h3);
      if (p) textCell.push(p);
    }
    if (textCell.length === 1) textCell = textCell[0];
    if (textCell.length === 0) textCell = '';

    // Add the row: [image, text]
    rows.push([
      img || '',
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
