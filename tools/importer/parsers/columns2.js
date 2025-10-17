/* global WebImporter */
export default function parse(element, { document }) {
  // --- COLUMN 1: Logo, awards, currency/app/copyright ---
  const logoImg = element.querySelector('img');
  const awardsUl = Array.from(element.querySelectorAll('ul')).find(ul => ul.querySelectorAll('img').length > 0 && ul.querySelectorAll('li').length > 1);
  const currencyLabel = Array.from(element.querySelectorAll('label')).find(l => l.textContent.trim().startsWith('Currency:'));
  const appUl = Array.from(element.querySelectorAll('ul')).find(ul => Array.from(ul.querySelectorAll('a')).some(a => /iOS|Android/.test(a.textContent)));
  const copyrightP = Array.from(element.querySelectorAll('p')).find(p => p.textContent.trim().match(/^©/));
  const col1 = [logoImg, awardsUl, currencyLabel, appUl, copyrightP].filter(Boolean);

  // --- COLUMN 2: PLAN A VOYAGE ---
  const planVoyageDiv = Array.from(element.querySelectorAll('.js-FooterItems .js-FooterAccordion')).find(div => {
    const heading = div.querySelector('p');
    return heading && /plan a voyage/i.test(heading.textContent);
  });
  const col2 = planVoyageDiv ? [planVoyageDiv] : [];

  // --- COLUMN 3: DESTINATIONS ---
  const destinationsDiv = Array.from(element.querySelectorAll('.js-FooterItems .js-FooterAccordion')).find(div => {
    const heading = div.querySelector('p');
    return heading && /destinations/i.test(heading.textContent);
  });
  const col3 = destinationsDiv ? [destinationsDiv] : [];

  // --- COLUMN 4: VIRGIN VOYAGES ---
  const virginVoyagesDiv = Array.from(element.querySelectorAll('.js-FooterItems .js-FooterAccordion')).find(div => {
    const heading = div.querySelector('p');
    return heading && /virgin voyages/i.test(heading.textContent);
  });
  const col4 = virginVoyagesDiv ? [virginVoyagesDiv] : [];

  // --- COLUMN 5: Stay Connected (newsletter/social) ---
  let stayConnectedDiv = Array.from(element.querySelectorAll('div')).find(div => {
    const p = div.querySelector('p');
    return p && /stay connected/i.test(p.textContent);
  });
  if (!stayConnectedDiv) {
    stayConnectedDiv = Array.from(element.querySelectorAll('form')).map(f => f.closest('div')).find(Boolean);
  }
  const col5 = stayConnectedDiv ? [stayConnectedDiv] : [];

  // --- Policy links (bottom bar) ---
  const policyUl = Array.from(element.querySelectorAll('ul')).reverse().find(ul => ul.querySelectorAll('a').length > 5);

  // --- Build table rows ---
  const headerRow = ['Columns (columns2)'];
  // Second row: main columns
  const secondRow = [col1, col2, col3, col4, col5];

  // Third row: policies links distributed across all columns
  let policyLinks = [];
  if (policyUl) {
    // Split the links evenly across the 5 columns
    const links = Array.from(policyUl.querySelectorAll('li'));
    const perCol = Math.ceil(links.length / 5);
    for (let i = 0; i < 5; i++) {
      const colLinks = links.slice(i * perCol, (i + 1) * perCol);
      if (colLinks.length) {
        const ul = document.createElement('ul');
        colLinks.forEach(li => ul.appendChild(li.cloneNode(true)));
        policyLinks.push([ul]);
      } else {
        policyLinks.push(['']);
      }
    }
  }
  if (policyLinks.length === 0) {
    policyLinks = ['', '', '', '', ''];
  }

  const cells = [
    headerRow,
    secondRow,
    policyLinks.map(arr => arr[0]),
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
