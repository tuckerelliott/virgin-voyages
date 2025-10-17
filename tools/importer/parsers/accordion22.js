/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the accordion root
  const accordionRoot = element.querySelector('.js-AccordionSeo');
  if (!accordionRoot) return;

  // Find the accordion header button
  const button = accordionRoot.querySelector('button');
  let titleCell = null;
  if (button) {
    // Clone the button to preserve formatting but remove chevron icon
    const btnClone = button.cloneNode(true);
    btnClone.querySelectorAll('img').forEach(img => img.remove());
    btnClone.querySelectorAll('span').forEach(span => {
      if (!span.textContent.trim()) span.remove();
    });
    titleCell = Array.from(btnClone.childNodes);
    if (titleCell.length === 1) titleCell = titleCell[0];
  }

  // Find the preview and full content (summary + expanded)
  const preview = accordionRoot.querySelector('.js-AccordionSeoPreview');
  const expanded = accordionRoot.querySelector('.js-AccordionSeoBodyContent > div[style*="display: var(--body-content-display"]');
  let contentCell = document.createElement('div');
  if (preview) contentCell.appendChild(preview.cloneNode(true));
  if (expanded) contentCell.appendChild(expanded.cloneNode(true));

  // Build the table rows
  const rows = [];
  rows.push(['Accordion (accordion22)']);
  if (titleCell && contentCell.childNodes.length) {
    rows.push([
      titleCell,
      contentCell
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
