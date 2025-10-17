/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Carousel (carousel9)'];
  const rows = [headerRow];

  // Find the swiper wrapper containing all slides
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // For each swiper-slide, extract image and text content
  const slides = swiperWrapper.querySelectorAll('.swiper-slide');
  slides.forEach((slide) => {
    // Find the main flex row containing both text and image columns
    const flexRow = Array.from(slide.children).find(div => div.tagName === 'DIV');
    if (!flexRow) return;

    // Image column: child containing .Multimedia
    const imageCol = Array.from(flexRow.children).find(c => c.querySelector('.Multimedia'));
    let imageEl = null;
    if (imageCol) {
      const multimedia = imageCol.querySelector('.Multimedia');
      if (multimedia) {
        const img = multimedia.querySelector('img');
        if (img) imageEl = img.cloneNode(true);
      }
    }

    // Text column: child with class 'flex-col'
    const textCol = Array.from(flexRow.children).find(c => c.classList.contains('flex-col'));
    let textContent = '';
    if (textCol) {
      // Compose all text content as a single block, preserving semantic structure
      const textBlock = document.createElement('div');
      // Section label: first <p> before <h2>
      const label = textCol.querySelector('p');
      if (label) textBlock.appendChild(label.cloneNode(true));
      // Heading: first <h2>
      const heading = textCol.querySelector('h2');
      if (heading) textBlock.appendChild(heading.cloneNode(true));
      // Description: first <p> after <h2>
      let description = null;
      if (heading) {
        let next = heading.nextElementSibling;
        while (next) {
          if (next.tagName && next.tagName.toLowerCase() === 'p') {
            description = next;
            break;
          }
          next = next.nextElementSibling;
        }
      }
      if (description) textBlock.appendChild(description.cloneNode(true));
      // CTA: first <a>
      const cta = textCol.querySelector('a');
      if (cta) textBlock.appendChild(cta.cloneNode(true));
      textContent = textBlock.childNodes.length ? textBlock : '';
    }

    // Only add row if image is present
    if (imageEl) {
      rows.push([
        imageEl,
        textContent
      ]);
    }
  });

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
