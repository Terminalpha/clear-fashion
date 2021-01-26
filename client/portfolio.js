// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectSort = document.querySelector('#sort-select');
const selectBrand = document.querySelector('#brand-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};
const renderBrands = brands => {
  
  const options = Array.from(
    {'length': brand.length},
    (value, index) => `<option value="${brands[index]}">${brands[index]}</option>`
  ).join('');

  selectBrand.innerHTML = options;
  
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);

  const brands=getBrandsFromProducts(currentProducts);
  renderBrands(brands);
};

function getBrandsFromProducts(products){
  return [...new Set(products.map(product=>product.brand))];
}

/**
 * Declaration of all Listeners
 */
selectPage.addEventListener('change',event=>{
  fetchProducts(parseInt(event.target.value),selectShow.value )
    .then(setCurrentProducts)
    .then(() => render(currentProducts,currentPagination ));
  
});
selectSort.addEventListener('change',event=>{
  
  if( event.target.value=='price-asc'){
    
    fetchProducts(currentPagination.currentPage, selectShow.value)
    
    .then(setCurrentProducts)
    .then(() => render(currentProducts.sort(function (l, r) {
      return l.price - r.price;
    }), currentPagination));
  }
  else if( event.target.value=='price-desc'){
    fetchProducts(currentPagination.currentPage, selectShow.value)
    
    .then(setCurrentProducts)
    .then(() => render(currentProducts.sort(function (l, r) {
      return r.price - l.price;
    }), currentPagination));
  }
  else if( event.target.value=='date-asc'){
    fetchProducts(currentPagination.currentPage, selectShow.value)
    
    .then(setCurrentProducts)
    .then(() => render(currentProducts.sort(function (l, r) {
      return new Date(r.date) - new Date(l.date);
    }), currentPagination));
  }
  else if( event.target.value=='date-desc'){
    fetchProducts(currentPagination.currentPage, selectShow.value)
    
    .then(setCurrentProducts)
    .then(() => render(currentProducts.sort(function (l, r) {
      return new Date(l.date) - new Date(r.date);
    }), currentPagination));
  }
});
/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);
