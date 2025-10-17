/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract background image (main hero image)
  let bgImg = null;
  const multimediaDiv = element.querySelector('.Multimedia');
  if (multimediaDiv) {
    const pic = multimediaDiv.querySelector('picture');
    if (pic) {
      const img = pic.querySelector('img');
      if (img) bgImg = img;
    }
  }

  // 2. Extract headline
  let headline = '';
  const headlineEl = element.querySelector('h1');
  if (headlineEl) {
    headline = headlineEl.textContent.trim();
  }

  // 3. Extract the promo image (contains all promo text visually)
  let promoImg = null;
  const promoPic = element.querySelector('.ContentAlignmentCol .Picture img');
  if (promoPic) {
    promoImg = promoPic.cloneNode(true);
  }

  // 4. Compose content cell: headline + promo image
  const contentCell = document.createElement('div');
  if (headline) {
    const h = document.createElement('h1');
    h.textContent = headline;
    contentCell.appendChild(h);
  }
  if (promoImg) {
    contentCell.appendChild(promoImg);
  }

  // 5. Build table rows
  const headerRow = ['Hero (hero8)'];
  const bgImgRow = [bgImg ? bgImg : ''];
  const contentRow = [contentCell];

  // 6. Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow
  ], document);

  // 7. Replace the original element with the table
  element.replaceWith(table);
}
