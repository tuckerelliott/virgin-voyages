/* global WebImporter */
export default function parse(element, { document }) {
  // Find the card container
  const cardsList = element.querySelector('ul.imageGrid');
  if (!cardsList) return;

  // Get all card items
  const cardItems = Array.from(cardsList.querySelectorAll('li'));

  // Prepare table rows
  const rows = [];
  // Header row - must match block name exactly
  rows.push(['Cards (cards19)']);

  cardItems.forEach((li) => {
    // Image: reference the actual <img> element
    const img = li.querySelector('img');
    if (!img) return;

    // Find the div that contains the card's text content
    // Use a less specific selector to avoid invalid pseudo-class
    // Look for the first div that contains an h3 (title)
    let textDiv = null;
    const divs = li.querySelectorAll('div');
    for (const div of divs) {
      if (div.querySelector('h3')) {
        textDiv = div;
        break;
      }
    }
    if (!textDiv) return;

    // Extract title (h3), description (first div after h3), and CTA (a)
    const title = textDiv.querySelector('h3');
    // Description is the first div after the h3
    let desc = null;
    if (title) {
      let el = title.nextElementSibling;
      while (el) {
        if (el.tagName === 'DIV') {
          desc = el;
          break;
        }
        el = el.nextElementSibling;
      }
    }
    const cta = textDiv.querySelector('a');

    // Compose the text cell
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title.cloneNode(true));
    if (desc) textCell.appendChild(desc.cloneNode(true));
    if (cta) textCell.appendChild(cta.cloneNode(true));

    rows.push([
      img.cloneNode(true),
      textCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
