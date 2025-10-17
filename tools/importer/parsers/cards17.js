/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards17) block
  const headerRow = ['Cards (cards17)'];

  // Find all card containers
  const flexContainer = element.querySelector('div.flex');
  if (!flexContainer) return;
  const cardDivs = Array.from(flexContainer.children).filter(child => child.tagName === 'DIV');

  const rows = cardDivs.map(card => {
    // Image/Icon
    const img = card.querySelector('img');

    // Title
    const title = card.querySelector('h3');
    // Description (first <p>)
    const desc = card.querySelector('p');
    // We'll preserve the full <p> including <br> and price (do not split or remove price)
    // This ensures all text content and formatting is preserved
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title.cloneNode(true));
    if (desc) textCell.appendChild(desc.cloneNode(true));
    // Add the red divider after the <p> (visual accent)
    const divider = document.createElement('hr');
    divider.style.border = 'none';
    divider.style.height = '2px';
    divider.style.background = '#CC0000';
    divider.style.width = '45px';
    divider.style.margin = '0.5em 0 0 0';
    textCell.appendChild(divider);
    return [img, textCell];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
