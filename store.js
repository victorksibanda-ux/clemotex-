const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}));

const cards = [...document.querySelectorAll('.store-card')];
const filters = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('#product-search');
const sort = document.querySelector('#product-sort');
const resultsCount = document.querySelector('#results-count');
const noResults = document.querySelector('#no-results');
let selectedCategory = 'all';

function updateCatalog() {
  const term = search.value.trim().toLowerCase();
  const visibleCards = cards.filter(card => {
    const matchesCategory = selectedCategory === 'all' || card.dataset.category === selectedCategory;
    const matchesSearch = `${card.dataset.name} ${card.dataset.description}`.toLowerCase().includes(term);
    card.hidden = !matchesCategory || !matchesSearch;
    return !card.hidden;
  });

  if (sort.value === 'name') {
    visibleCards.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    visibleCards.forEach(card => card.parentElement.append(card));
  } else {
    cards.forEach(card => card.parentElement.append(card));
  }

  resultsCount.textContent = `${visibleCards.length} ${visibleCards.length === 1 ? 'product' : 'products'}`;
  noResults.hidden = visibleCards.length > 0;
}

filters.forEach(button => button.addEventListener('click', () => {
  selectedCategory = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  updateCatalog();
}));
search.addEventListener('input', updateCatalog);
sort.addEventListener('change', updateCatalog);

const dialog = document.querySelector('#quote-dialog');
const quoteItems = document.querySelector('#quote-items');
const quoteEmpty = document.querySelector('#quote-empty');
const quoteContent = document.querySelector('#quote-content');
const cartCount = document.querySelector('.cart-count');
const quoteForm = document.querySelector('#quote-form');
const quoteStatus = document.querySelector('#quote-status');
const cart = new Map();

function getTankSpecifications(card) {
  if (!card.querySelector('.tank-specifications')) return {};

  const capacity = card.querySelector('.tank-capacity').value.trim();
  const length = card.querySelector('.tank-length').value.trim();
  const width = card.querySelector('.tank-width').value.trim();
  const height = card.querySelector('.tank-height').value.trim();
  const dimensionsEntered = length || width || height;

  return {
    capacity: capacity ? `${capacity} ${card.querySelector('.tank-capacity-unit').value}` : '',
    dimensions: dimensionsEntered
      ? `${length || '—'} × ${width || '—'} × ${height || '—'} ${card.querySelector('.tank-dimension-unit').value}`
      : '',
    orientation: card.querySelector('.tank-orientation').value === 'No preference'
      ? ''
      : card.querySelector('.tank-orientation').value
  };
}

function formatTankSpecifications(specifications) {
  return [
    specifications.capacity && `Capacity: ${specifications.capacity}`,
    specifications.dimensions && `Dimensions (L × W × H): ${specifications.dimensions}`,
    specifications.orientation && `Orientation: ${specifications.orientation}`
  ].filter(Boolean).join(' · ');
}

function updateCart() {
  quoteItems.replaceChildren();
  let totalItems = 0;
  cart.forEach(item => {
    totalItems += item.quantity;
    const card = cards.find(product => product.dataset.id === item.id);
    const row = document.createElement('li');
    row.className = 'quote-item';

    if (card.dataset.image) {
      const image = document.createElement('img');
      image.src = card.dataset.image;
      image.alt = card.dataset.imageAlt;
      row.append(image);
    } else {
      const image = document.createElement('span');
      image.className = 'quote-thumb';
      image.setAttribute('aria-hidden', 'true');
      row.append(image);
    }

    const details = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = card.dataset.name;
    const size = document.createElement('p');
    size.textContent = item.size;
    details.append(title, size);
    const specifications = formatTankSpecifications(item.specifications);
    if (specifications) {
      const specs = document.createElement('p');
      specs.className = 'quote-specs';
      specs.textContent = specifications;
      details.append(specs);
    }

    const controls = document.createElement('div');
    controls.className = 'quote-item-controls';
    const decrease = document.createElement('button');
    decrease.type = 'button';
    decrease.textContent = '−';
    decrease.setAttribute('aria-label', `Decrease quantity of ${card.dataset.name}`);
    decrease.addEventListener('click', () => changeQuantity(item.key, -1));
    const quantity = document.createElement('output');
    quantity.textContent = String(item.quantity);
    const increase = document.createElement('button');
    increase.type = 'button';
    increase.textContent = '+';
    increase.setAttribute('aria-label', `Increase quantity of ${card.dataset.name}`);
    increase.addEventListener('click', () => changeQuantity(item.key, 1));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'quote-item-remove';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      cart.delete(item.key);
      updateCart();
    });
    controls.append(decrease, quantity, increase, remove);
    row.append(details, controls);
    quoteItems.append(row);
  });

  cartCount.textContent = String(totalItems);
  quoteEmpty.hidden = cart.size > 0;
  quoteContent.hidden = cart.size === 0;
}

function changeQuantity(key, amount) {
  const item = cart.get(key);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart.delete(key);
  updateCart();
}

document.querySelectorAll('.add-to-quote').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.store-card');
  const size = card.querySelector('.product-size').value;
  const specifications = getTankSpecifications(card);
  const key = `${card.dataset.id}:${size}:${JSON.stringify(specifications)}`;
  const item = cart.get(key);
  if (item) item.quantity += 1;
  else cart.set(key, { id: card.dataset.id, size, specifications, quantity: 1, key });
  updateCart();
  button.querySelector('span').textContent = 'Added to quote list';
  window.setTimeout(() => { button.querySelector('span').textContent = 'Add to quote list'; }, 1400);
}));

function openCart() {
  nav.classList.remove('open');
  menuToggle.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  updateCart();
  dialog.showModal();
  document.querySelector('.dialog-close').focus();
}
document.querySelectorAll('[data-open-cart]').forEach(button => button.addEventListener('click', openCart));
document.querySelectorAll('[data-close-cart]').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

quoteForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!cart.size || !quoteForm.reportValidity()) return;

  const formData = new FormData(quoteForm);
  const products = [...cart.values()].map(item => {
    const product = cards.find(card => card.dataset.id === item.id);
    const specifications = formatTankSpecifications(item.specifications) || 'No additional tank specifications';
    return `- ${product.dataset.name} | ${item.size} | Quantity: ${item.quantity} | ${specifications}`;
  }).join('\n');
  const body = [
    `Name: ${formData.get('name')}`,
    `Email: ${formData.get('email')}`,
    `Phone: ${formData.get('phone') || 'Not provided'}`,
    `Location: ${formData.get('location') || 'Not provided'}`,
    '',
    'Requested products:',
    products,
    '',
    `Additional requirements:\n${formData.get('notes') || 'None provided'}`
  ].join('\n');
  const subject = encodeURIComponent('Product quote request');
  quoteStatus.textContent = 'Opening your email application to send the quote request.';
  window.location.href = `mailto:clemotex.engineering@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
});

updateCatalog();
updateCart();
