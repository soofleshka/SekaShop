import {
  loadCart,
  loadAuthenticatedUser,
  addEventsForProductButtons,
  getLikedProducts,
  productsHTMLOutput,
  getParameter,
} from './exportFunctions/comonFunctions.js';

let catalogProducts = {};

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  loadAuthenticatedUser();
  let categoryId = getParameter('categoryId');
  loadCategory(categoryId);
  loadProductsByCategory(categoryId);
  addEventsForCategoryButtons();
});

function loadCategory(categoryId) {
  let request = new XMLHttpRequest();

  function requestLoad() {
    if (request.readyState == 4) {
      let status = request.status;
      if (status == 200) {
        displayCategory(request.responseText);
      } else {
        console.log('Ответ сервера: ' + request.statusText);
      }
    }
  }

  let url = '/api/category/' + categoryId;
  request.open('GET', url);
  request.onload = requestLoad;
  request.send();
}

function displayCategory(response) {
  let category = JSON.parse(response);

  document.querySelector('.category__title').textContent = category.name;
  document.querySelector('.category__description').textContent =
    category.description;
}

function loadProductsByCategory(categoryId) {
  let request = new XMLHttpRequest();

  function requestLoad() {
    if (request.readyState == 4) {
      let status = request.status;
      if (status == 200) {
        // displayProductsByCategory(request.responseText);
        let response = request.responseText;
        catalogProducts = JSON.parse(response);
        getLikedProducts(displayProductsByCategory);
      } else {
        console.log('Ответ сервера: ' + request.statusText);
      }
    }
  }

  let url = '/api/products/GetProductsByCategory/' + categoryId;
  request.open('GET', url);
  request.onload = requestLoad;
  request.send();
}

function displayProductsByCategory(response) {
  let likedProducts = JSON.parse(response);
  let catalog = catalogProducts;
  let out = productsHTMLOutput(catalog, likedProducts);

  let productsList = document.querySelector('.category__catalog-list');
  productsList.innerHTML = out;

  addEventsForProductButtons();
}

function displayProductsByCategory1(response) {
  let catalog = JSON.parse(response);

  let out = '';
  for (let index in catalog) {
    out += '<div class="col-md-6 col-lg-4 px-4 category__catalog-item">';
    out += "<div class='product-item'>";
    out +=
      "<a href='/productcard.html?productId=" +
      catalog[index].id +
      "' class='product-item__link p-4'>";
    out +=
      "<img src='" +
      catalog[index].mainImage +
      "' alt='" +
      catalog[index].title +
      "' class='product-item__image'/>";
    out += '<h4 class="product-item__tilte">' + catalog[index].title + '</h4>';
    out += '<p class="product-item__description">';
    out += catalog[index].description;
    out += '</p>';
    out += '</a>';
    out += '<div class="product-item__shopping-panel p-4">';
    out +=
      '<div class="product-item__price">' + catalog[index].price + '.00p</div>';
    out += '<div class="product-item__icons">';
    out +=
      '<button data-articul="' +
      catalog[index].id +
      '" class="btn product-item__icon add-to-cart">';
    out += '<i class="fas fa-shopping-cart"></i>';
    out += '</button>';
    out += '<button class="btn product-item__icon">';
    out += '<i class="far fa-heart"></i>';
    out += '</button>';
    out += '</div>';
    out += '</div>';
    out += '</div>';
    out += '</div>';
  }
  let productsList = document.querySelector('.category__catalog-list');
  productsList.innerHTML = out;

  addEventsForProductButtons();
}

function addEventsForCategoryButtons() {
  let categoryButtonElements = document.querySelectorAll('.category__button');
  for (let button of categoryButtonElements) {
    button.addEventListener('click', updateCategoryProducts);
  }
}

function updateCategoryProducts() {
  let articul = this.getAttribute('data-articul');

  loadCategory(articul);
  loadProductsByCategory(articul);
  window.history.pushState(
    {},
    null,
    window.location.href.replace(/categoryId=[\d]*$/, 'categoryId=' + articul)
  );
}
