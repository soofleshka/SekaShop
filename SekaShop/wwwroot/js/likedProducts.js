import {
  loadCart,
  loadAuthenticatedUser,
  addEventsForProductButtons,
  getLikedProducts,
  productsHTMLOutput,
} from './exportFunctions/comonFunctions.js';

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  loadAuthenticatedUser();
  getLikedProducts(displayLikedProducts);
});

function displayLikedProducts(response) {
  let catalog = JSON.parse(response);
  const productsElement = document.querySelector('.popular-products__title');
  if (catalog.length === 0) {
    productsElement.classList.remove('section-title');
    productsElement.innerHTML =
      "Вы не добавили в понравившиеся ни одного товара <a href='index.html' class='btn btn-primary'>продолжить покупки</a>";
    return;
  }
  productsElement.textContent = 'Понравившиеся товары';
  let out = productsHTMLOutput(catalog, catalog);

  let productsList = document.querySelector('.popular-products__list');
  productsList.innerHTML = out;

  addEventsForProductButtons();
}
