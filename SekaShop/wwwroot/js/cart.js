import {
  loadAuthenticatedUser,
  decreaseCartSpanCount,
  displayLikedSpanCount,
  loadCart,
  increaseCartSpanCount,
  cart,
} from './exportFunctions/comonFunctions.js';
let cartToken;
let cartProducts;

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  loadAuthenticatedUser();
  loadCartProducts();
});

function loadCartProducts() {
  cartToken = localStorage.getItem('cartToken');
  if (cartToken === null) {
    displayCart();
    return;
  }

  let request = new XMLHttpRequest();

  function requestLoad() {
    if (request.readyState == 4) {
      let status = request.status;
      if (status == 200) {
        const cartFromLocalStorage = JSON.parse(request.responseText);
        if (cartFromLocalStorage != null) cartProducts = cartFromLocalStorage;
        displayCartSpanCount();
        displayLikedSpanCount();
        displayCart();
      } else {
        console.log('Ответ сервера ' + request.statusText);
      }
    }
  }
  let url = '/api/cartproduct/' + cartToken;
  request.open('get', url);
  request.onload = requestLoad;
  request.send();
}

function displayCartSpanCount() {
  let cartSpanCountElement = document.querySelector('.header__icon-count');
  if (cartProducts != undefined) {
    let count = 0;
    for (let product in cartProducts) {
      count += cartProducts[product].quantity;
    }
    cartSpanCountElement.textContent = count;
  } else cartSpanCountElement.textContent = 0;
}

function displayCart() {
  if (isEmptyObject(cartProducts) || cartProducts?.length === 0) {
    displayEmptyCart();
    return;
  }
  let out = '';
  for (let product of cartProducts) {
    out += '<li class="cart-list__item">';
    out +=
      '<img src="' +
      product.mainImage +
      '" alt="' +
      product.title +
      '" class="cart-list__image" />';
    out +=
      '<a href="productcard.html?productId=' +
      product.id +
      '" class="cart-list__tilte">' +
      product.title +
      '</a>';
    out += '<span class="cart-list__price">' + product.price + '.00p</span>';
    out +=
      '<input type="number" class="form-control cart-list__count" data-articul=' +
      product.id +
      ' min="1" maxlength="3"  value="' +
      product.quantity +
      '"/>';
    out +=
      '<span class="cart-list__total">' +
      product.price * product.quantity +
      '.00p</span>';
    out +=
      '<button type="button" class="btn-close" data-articul=' +
      product.id +
      ' aria-label="Close"></button>';
    out += '</li>';
  }
  document.querySelector('.cart-list').innerHTML = out;

  out = '';
  out += '<span class="cart-totat__tilte h3">Итого: </span>';
  out +=
    '<span class="cart-total__cost h2">' +
    calculateTotalPrice(cartProducts) +
    '.00p</span>';
  document.querySelector('.cart-total').innerHTML = out;

  addEventsForCartButtons();
}

function calculateTotalPrice(products) {
  let totalSum = 0;
  for (let product of products) {
    totalSum += product.price * product.quantity;
  }
  return totalSum;
}

function isEmptyObject(value) {
  return Object.keys(value).length === 0 && value.constructor === Object;
}

function addEventsForCartButtons() {
  const closeButtonsElements = document.querySelectorAll('.btn-close');
  for (let button of closeButtonsElements)
    button.addEventListener('click', removeProductFromCart);
  const countButtonsElements = document.querySelectorAll('.cart-list__count');
  for (let button of countButtonsElements)
    button.addEventListener('change', changeProductCount);
  document
    .querySelector('.purchase-button')
    .addEventListener('click', purchaseCart);
}

function removeProductFromCart() {
  const articul = this.getAttribute('data-articul');
  const listElement = this.parentNode;

  let request = new XMLHttpRequest();

  function responceLoad() {
    if (request.readyState == 4) {
      let status = request.status;
      if (status == 200) {
        let cartProduct = JSON.parse(request.responseText);
        decreaseCartSpanCount(cartProduct.quantity);
        listElement.remove();
        deleteCartProduct(articul);
        if (cartProducts.length < 1) {
          displayEmptyCart();
          return;
        }
        document.querySelector('.cart-total__cost').textContent =
          calculateTotalPrice(cartProducts) + '.00p';
      } else console.log('Ответ сервера ' + request.statusText);
    }
  }
  let url = '/api/CartProduct/?cartId=' + cartToken + '&productId=' + articul;
  request.open('DELETE', url);
  request.onload = responceLoad;
  request.send();
}

function changeProductCount() {
  const articul = this.getAttribute('data-articul');
  let newCount = this.value;
  if (newCount < 1) {
    this.value = newCount = 1;
  }
  if (newCount > 999) {
    this.value = newCount = 999;
  }

  let request = new XMLHttpRequest();

  function responceLoad() {
    if (request.readyState == 4) {
      let status = request.status;
      if (status == 200) {
        let cartProduct = JSON.parse(request.responseText);
        increaseCartSpanCount(
          cartProduct.quantity -
            cartProducts.find((cp) => cp.id == articul).quantity
        );
        changeCartProductQuantity(articul, cartProduct.quantity);
        document.querySelector('.cart-total__cost').textContent =
          calculateTotalPrice(cartProducts) + '.00p';
      } else console.log('Ответ сервера ' + request.statusText);
    }
  }
  let url =
    '/api/CartProduct/?cartId=' +
    cartToken +
    '&productId=' +
    articul +
    '&count=' +
    newCount;
  request.open('PUT', url);
  request.onload = responceLoad;
  request.send();
}

function deleteCartProduct(id) {
  cartProducts = cartProducts.filter((cp) => cp.id != id);
}
function changeCartProductQuantity(id, quantity) {
  cartProducts = cartProducts.map((cp) => {
    if (cp.id == id) {
      cp.quantity = quantity;
    }
    return cp;
  });
}

function purchaseCart(e) {
  e.preventDefault();

  let request = new XMLHttpRequest();

  function responceLoad() {
    if (request.readyState == 4) {
      let status = request.status;
      if (status == 200) {
        cartProducts = [];
        localStorage.setItem('cartToken', cart.id);
        window.location.replace('index.html');
      } else {
        console.log('Ответ сервера ' + request.statusText);
        alert('Что-то пошло не так');
      }
    }
  }
  let url = '/api/cart/?cartId=' + cartToken;
  request.open('PUT', url);
  request.onload = responceLoad;
  request.send();
}

function displayEmptyCart() {
  document.querySelector('.cart__title').innerHTML =
    "Ваша корзина пуста <a href='index.html' class='btn btn-primary'>продолжить покупки</a>";
  document.querySelector('.cart-list').hidden = true;
  document.querySelector('.cart-total').hidden = true;
  document.querySelector('.cart-butttons').hidden = true;
}
