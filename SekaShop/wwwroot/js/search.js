import {
  loadCart,
  loadAuthenticatedUser,
  addEventsForProductButtons,
  getSearchingProducts,
  productsHTMLOutput,
  getParameter,
  getLikedProducts,
} from './exportFunctions/comonFunctions.js';

const searchString = getParameter('search');

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  loadAuthenticatedUser();
  getSearchingProducts(displaySearchingProducts, searchString);
});

function displaySearchingProducts(response) {
  let products = JSON.parse(response);
  let likedProducts;
  getLikedProducts((response) => {
    likedProducts = JSON.parse(response);
    const productsElement = document.querySelector('.popular-products__title');
    if (products.length === 0) {
      productsElement.classList.remove('section-title');
      productsElement.innerHTML =
        "Не найдено ни одного продукта <a href='index.html' class='btn btn-primary'>продолжить покупки</a>";
      return;
    }
    productsElement.textContent = 'Поиск по: ' + searchString;
    let out = productsHTMLOutput(products, likedProducts);

    let productsList = document.querySelector('.popular-products__list');
    productsList.innerHTML = out;

    addEventsForProductButtons();
  });
}
