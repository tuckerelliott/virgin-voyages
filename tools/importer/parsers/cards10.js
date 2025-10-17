/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards10) block
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  const cardsList = element.querySelector('ul.imageGrid');
  if (!cardsList) return;

  // Each card is an <li>
  cardsList.querySelectorAll(':scope > li').forEach((li) => {
    // Image: first <img> inside the card
    const img = li.querySelector('img');

    // Text content: get the heading and description
    // The text block is the div after the image container
    const textBlock = li.querySelector('div.s992\\:order-2, div.pt-5');
    let textContent = [];
    if (textBlock) {
      // Heading
      const heading = textBlock.querySelector('h2');
      if (heading) textContent.push(heading);
      // Description
      // Only select the description div that is not the heading
      const desc = Array.from(textBlock.querySelectorAll('div'))
        .find(d => !d.querySelector('h2') && d.textContent.trim());
      if (desc) textContent.push(desc);
    }

    // Defensive: fallback to all text if above fails
    if (textContent.length === 0) {
      // Try to get all text nodes
      textContent = [document.createTextNode(li.textContent.trim())];
    }

    rows.push([
      img || '',
      textContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
