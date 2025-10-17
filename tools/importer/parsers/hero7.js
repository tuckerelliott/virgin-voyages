/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the hero background image (reference existing <img> element)
  let bgImg = null;
  const picture = element.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) bgImg = img;
  }

  // Extract heading from <h1> if present and non-empty
  let headingEl = null;
  const h1 = element.querySelector('h1');
  if (h1 && h1.textContent.trim()) {
    headingEl = h1;
  }

  // Extract subheading (the only visible span in .js-HeroContent)
  let subheadingEl = null;
  const heroContent = element.querySelector('.js-HeroContent');
  if (heroContent) {
    const span = heroContent.querySelector('span');
    if (span && span.textContent.trim()) {
      subheadingEl = span;
    }
  }

  // Extract CTA link (chevron)
  let ctaLink = null;
  if (heroContent) {
    const ctaAnchor = heroContent.querySelector('a');
    if (ctaAnchor) {
      ctaLink = ctaAnchor;
    }
  }

  // Compose content cell: heading, subheading, CTA
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (subheadingEl) contentCell.push(subheadingEl);
  if (ctaLink) contentCell.push(ctaLink);

  // Table rows (header must match block name exactly)
  const headerRow = ['Hero (hero7)'];
  const imageRow = [bgImg ? bgImg : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
