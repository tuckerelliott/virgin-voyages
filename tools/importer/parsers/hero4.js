/* global WebImporter */
export default function parse(element, { document }) {
  // --- Hero (hero4) block ---
  // 1. Header row
  const headerRow = ['Hero (hero4)'];

  // 2. Background image row: get the <img> inside <picture> in the Multimedia div
  let bgImg = null;
  const multimedia = element.querySelector('.Multimedia');
  if (multimedia) {
    // Try to get the <img> inside <picture>
    const img = multimedia.querySelector('img');
    if (img) bgImg = img;
    // If no <img>, fallback to video poster or src
    if (!bgImg) {
      const video = multimedia.querySelector('video');
      if (video && video.poster) {
        const imgEl = document.createElement('img');
        imgEl.src = video.poster;
        bgImg = imgEl;
      } else if (video && video.src) {
        // fallback: use the video src as an image if needed
        const imgEl = document.createElement('img');
        imgEl.src = video.src;
        bgImg = imgEl;
      }
    }
  }

  // 3. Content row: get all text content from the OneColumnWrapper
  let contentCell = '';
  const content = element.querySelector('.OneColumnWrapper');
  if (content) {
    // Collect all text nodes and block-level elements (h1, h2, h3, p, a)
    const frag = document.createDocumentFragment();
    // Headings
    const headings = content.querySelectorAll('h1, h2, h3');
    headings.forEach(h => frag.appendChild(h.cloneNode(true)));
    // Paragraphs
    const paragraphs = content.querySelectorAll('p');
    paragraphs.forEach(p => frag.appendChild(p.cloneNode(true)));
    // Links (if any)
    const links = content.querySelectorAll('a');
    links.forEach(a => {
      // Only add if not already inside a heading or paragraph
      if (!frag.contains(a)) frag.appendChild(a.cloneNode(true));
    });
    contentCell = frag.childNodes.length ? frag : '';
  }

  // Compose the rows
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentCell]
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
