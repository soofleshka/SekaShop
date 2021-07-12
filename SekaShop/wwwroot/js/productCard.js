import {
  loadCart,
  loadAuthenticatedUser,
  increaseCartSpanCount,
} from './exportFunctions/comonFunctions.js';

let cartToken = '';

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  loadAuthenticatedUser();
  loadProduct();
});

function get(name) {
  if (
    (name = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(
      location.search
    ))
  )
    return decodeURIComponent(name[1]);
}

function loadProduct() {
  cartToken = localStorage.getItem('cartToken');
  const productId = get('productId');

  if (productId === undefined) {
    let productCardElement = document.querySelector('.product-card');
    productCardElement.classList.add('mb-4');
    productCardElement.innerHTML =
      "Продукт не найден <a href='index.html' class='btn btn-primary'>продолжить покупки</a>";
    return;
  }

  let request = new XMLHttpRequest();

  function requestLoad() {
    if (request.readyState === 4) {
      let status = request.status;
      if (status === 200) {
        displayProduct(request.responseText);
      } else console.log('Ответ сервера: ' + request.statusText);
    }
  }

  let url = '/api/products/' + productId;
  request.open('GET', url);
  request.onload = requestLoad;
  request.send();
}

function displayProduct(response) {
  let product = JSON.parse(response);
  let out = '';
  let imageIndex = 1;

  //product output
  out += '<div class="row card-head">';
  out += '<div class="col-md-8">';
  out += '<div class="row g-3">';
  out += '<div class="col-12">';
  out += '<div class="card-head__image-holder">';
  out +=
    '<img src="' +
    product.mainImage +
    '" alt="' +
    product.title +
    '" class="d-block m-auto" />';
  out += '</div> </div>';
  out += '<div class="col-12 card-head__image-galery">';
  imageIndex++;
  for (let i = 0; i < 5; i++) {
    imageIndex++;
    out +=
      '<img  src="' +
      product.mainImage +
      '" data-slide-number="' +
      (i + 2) +
      '" alt="' +
      product.title +
      '" class="card-head__image img-fluid" />';
  }
  out += '</div> </div> </div>';

  out += '<div class="col-md-4 mt-3">';
  out += '<h3 class="card-head__product-title">' + product.title + '</h3>';
  out +=
    '<p class="card-head__product-price"> <i class="fas fa-hand-holding-usd"></i> <span class="product-item__price">' +
    product.price +
    '.00p.</span> </p>';
  out += '<div class="input-group mb-3">';
  out +=
    '<input type="text" class="form-control card-head__amount-input" value="1" aria-describedby="button-addon" />';
  out +=
    '<button class="btn card-head__buy-button" type="button" id="button-addon" data-articul="' +
    product.id +
    '"> Купить </button>';
  out += '</div> </div> </div>';

  out += '<div class="row my-3">';
  out += '<div class="col-md-8 full-description">';
  out += '<p class="description-title">Описание:</p>';
  out += '<p class="product-card__description">' + product.description + '</p>';
  out += '</div> </div>';

  document.querySelector('.product-card').innerHTML = out;
  document
    .querySelector('.card-head__buy-button')
    .addEventListener('click', buyProduct);
  //modal output
  out = '';
  for (let i = 1; i < imageIndex; i++) {
    out += '<div class="my-slides">';
    out += '<div class="numbertext">' + i + ' / ' + (imageIndex - 1) + '</div>';
    out += '<img src="' + product.mainImage + '" />';
    out += '</div>';
  }
  let modalContentElement = document.querySelector('.modalx-content');
  modalContentElement.insertAdjacentHTML('afterbegin', out);

  addModalEventListeners();
}
function addModalEventListeners() {
  document
    .querySelector('.card-head__image-holder')
    .addEventListener('click', () => {
      openModal();
      currentSlide(1);
    });
  const imageGaleryElement = document.querySelector('.card-head__image-galery');
  for (let galeryImageElement of imageGaleryElement.children) {
    galeryImageElement.addEventListener('click', () => {
      openModal();
      currentSlide(galeryImageElement.getAttribute('data-slide-number'));
    });
  }
  document
    .querySelector('.prev')
    .addEventListener('click', plusSlides.bind(null, -1));
  document
    .querySelector('.next')
    .addEventListener('click', plusSlides.bind(null, 1));
  document.querySelector('.close').addEventListener('click', closeModal);
}

function buyProduct() {
  let articul = this.getAttribute('data-articul');
  let count = parseInt(
    document.querySelector('.card-head__amount-input').value
  );

  let request = new XMLHttpRequest();

  function requestLoad() {
    if (request.readyState === 4) {
      let status = request.status;
      if (status === 200) {
        increaseCartSpanCount(count);
        window.location.href = 'cart.html';
      } else console.log('Ответ сервера: ' + request.statusText);
    }
  }

  let url =
    '/api/CartProduct/?cartId=' +
    cartToken +
    '&productId=' +
    articul +
    '&count=' +
    count;
  request.open('POST', url);
  request.onload = requestLoad;
  request.send();
}

function openModal() {
  document.getElementById('myModal').classList.remove('d-none');
  document.getElementById('myModal').classList.add('d-block');
}
function closeModal() {
  document.getElementById('myModal').classList.remove('d-block');
  document.getElementById('myModal').classList.add('d-none');
}

var slideIndex = 1;

function plusSlides(n) {
  console.log(n);
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName('my-slides');
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].classList.remove('d-block');
    slides[i].classList.add('d-none');
  }
  slides[slideIndex - 1].classList.remove('d-none');
  slides[slideIndex - 1].classList.add('d-block');
}
