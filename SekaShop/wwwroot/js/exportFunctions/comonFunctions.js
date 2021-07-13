export let cart = {};
export let cartToken = '';

export function loadCart() {
  cartToken = localStorage.getItem('cartToken');
  if (cartToken === null) cartToken = '';

  let request = new XMLHttpRequest();

  function requestLoad() {
    if (request.readyState == 4) {
      let status = request.status;
      if (status == 200) {
        cart = JSON.parse(request.responseText);
        if (cartToken === '') {
          cartToken = cart.id;
          localStorage.setItem('cartToken', cartToken);
        }
        displayCartSpanCount();
        displayLikedSpanCount();
        addSearchEventsHandlers();
      } else {
        console.log('Ответ сервера: ' + request.statusText);
      }
    }
  }

  let url = '/api/cart/' + cartToken;
  request.open('GET', url, false);
  request.onload = requestLoad;
  request.send();
}

export function displayCartSpanCount() {
  let cartSpanCountElement = document.querySelector('.header__icon-count');
  if (cart != undefined) {
    cartSpanCountElement.textContent = cart.cartQuantity;
  } else cartSpanCountElement.textContent = 0;
}

export function displayLikedSpanCount() {
  let cartSpanCountElement = document.querySelector('.liked-icon-count');
  if (cart != undefined) {
    cartSpanCountElement.textContent = cart.likedProductsQuantity;
  } else cartSpanCountElement.textContent = 0;
}

export function addEventsForProductButtons() {
  let addToCartButton = document.querySelectorAll('.add-to-cart');
  for (let button of addToCartButton) {
    button.addEventListener('click', addToCart);
  }
  let addToLikedButton = document.querySelectorAll('.add-to-liked');
  for (let button of addToLikedButton) {
    button.addEventListener('click', addToLiked);
  }
}

export function addToCart() {
  let articul = this.getAttribute('data-articul');

  let request = new XMLHttpRequest();

  function responceLoad() {
    if (request.readyState == 4) {
      let status = request.status;
      if (status == 200) {
        increaseCartSpanCount(1);
      } else console.log('Ответ сервера ' + request.statusText);
    }
  }
  let url =
    '/api/CartProduct/?cartId=' +
    cartToken +
    '&productId=' +
    articul +
    '&count=' +
    1;
  request.open('POST', url);
  request.onload = responceLoad;
  request.send();
}

export function addToLiked() {
  let articul = this.getAttribute('data-articul');
  const button = this;
  let request = new XMLHttpRequest();

  function responceLoad() {
    if (request.readyState == 4) {
      let status = request.status;
      if (status == 200) {
        increaseLikedSpanCount(1);
        let heartElements = button.querySelectorAll('.fa-heart');
        heartElements[0].classList.add('d-none');
        heartElements[1].classList.remove('d-none');
      } else if (status == 204) {
        decreaseLikedSpanCount(1);
        let heartElements = button.querySelectorAll('.fa-heart');
        heartElements[0].classList.remove('d-none');
        heartElements[1].classList.add('d-none');
      } else console.log('Ответ сервера ' + request.statusText);
    }
  }
  let url =
    '/api/CartLikedProduct/?cartId=' + cartToken + '&productId=' + articul;
  request.open('POST', url);
  request.onload = responceLoad;
  request.send();
}

export function increaseCartSpanCount(count) {
  let cartSpanCountElement = document.querySelector('.header__icon-count');
  cartSpanCountElement.textContent =
    parseInt(cartSpanCountElement.textContent) + count;
}

export function decreaseCartSpanCount(count) {
  let cartSpanCountElement = document.querySelector('.header__icon-count');
  cartSpanCountElement.textContent =
    parseInt(cartSpanCountElement.textContent) - count;
}

export function increaseLikedSpanCount(count) {
  let likedSpanCountElement = document.querySelector('.liked-icon-count');
  likedSpanCountElement.textContent =
    parseInt(likedSpanCountElement.textContent) + count;
}

export function decreaseLikedSpanCount(count) {
  let likedSpanCountElement = document.querySelector('.liked-icon-count');
  likedSpanCountElement.textContent =
    parseInt(likedSpanCountElement.textContent) - count;
}

export function getLikedProducts(responseHandler) {
  let request = new XMLHttpRequest();

  function responceLoad() {
    if (request.readyState == 4) {
      let status = request.status;
      if (status == 200) {
        responseHandler(request.responseText);
      } else {
        console.log('Ответ сервера ' + request.statusText);
      }
    }
  }

  request.open('GET', '/api/CartLikedProduct/' + cartToken);
  request.onload = responceLoad;
  request.send();
}

export function productsHTMLOutput(catalog, likedProducts) {
  let out = '';
  for (let index in catalog) {
    out += "<div class='col-md-6 col-lg-4 px-4 popular-products__item'>";
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
    out +=
      '<button data-articul="' +
      catalog[index].id +
      '" class="btn product-item__icon add-to-liked">';
    if (likedProducts.some((item) => item.id === catalog[index].id)) {
      out += '<i class="d-none far fa-heart"></i>';
      out += '<i class="fas fa-heart"></i>';
    } else {
      out += '<i class=" far fa-heart"></i>';
      out += '<i class="d-none fas fa-heart"></i>';
    }
    out += '</button>';
    out += '</div>';
    out += '</div>';
    out += '</div>';
    out += '</div>';
  }
  return out;
}

export async function loadAuthenticatedUser() {
  const response = await fetch('/api/account/IsAuthenticated', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  if (response.ok === true) {
    const data = await response.json();
    displayUser(data);
  }
}

function displayUser(user) {
  document.querySelector('.authorization-menu').innerHTML = `
  <li>
    <a class="dropdown-item" href="">Welcome <strong>${user.email}</strong></a>
  </li>
  <li>
    <a class="dropdown-item logout" href="">Logout</a>
  </li>`;
  addLogoutButtonEventHandler();
}

function addLogoutButtonEventHandler() {
  document.querySelector('.logout').addEventListener('click', async (e) => {
    e.preventDefault();
    const response = await fetch('/api/account/Logout');
    if (response.ok === true) {
      localStorage.removeItem('cartToken');
      window.location.replace('index.html');
    }
  });
}

export function addSearchEventsHandlers() {
  document.querySelector('.search-bar').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchString = e.target[0].value;
    window.location.replace('search.html?search=' + searchString);
  });
}

export function getSearchingProducts(responseHandler, searchString) {
  let request = new XMLHttpRequest();

  function responceLoad() {
    if (request.readyState == 4) {
      let status = request.status;
      if (status == 200) {
        responseHandler(request.responseText);
      } else {
        console.log('Ответ сервера ' + request.statusText);
      }
    }
  }
  console.log(searchString);
  request.open('GET', '/api/Products/search/?searchString=' + searchString);
  request.onload = responceLoad;
  request.send();
}

export function getParameter(name) {
  if (
    (name = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(
      location.search
    ))
  )
    return decodeURIComponent(name[1]);
}
