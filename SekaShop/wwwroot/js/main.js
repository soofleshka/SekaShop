import {
  loadCart,
  loadAuthenticatedUser,
  addEventsForProductButtons,
  getLikedProducts,
  productsHTMLOutput,
} from './exportFunctions/comonFunctions.js';
let recProducts = {};

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  loadAuthenticatedUser();
  getRecommendedProducts();
});

function getRecommendedProducts() {
  let request = new XMLHttpRequest();

  function responceLoad() {
    if (request.readyState == 4) {
      let status = request.status;
      if (status == 200) {
        let response = request.responseText;
        recProducts = JSON.parse(response);
        getLikedProducts(displayRecommendedProducts);
      } else {
        console.log('Ответ сервера ' + request.statusText);
      }
    }
  }

  request.open('GET', '/api/products/');
  request.onload = responceLoad;
  request.send();
}

function displayRecommendedProducts(response) {
  let likedProducts = JSON.parse(response);
  let catalog = recProducts;
  let out = productsHTMLOutput(catalog, likedProducts);

  let productsList = document.querySelector('.popular-products__list');
  productsList.innerHTML = out;

  addEventsForProductButtons();
}
