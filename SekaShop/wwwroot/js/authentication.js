(function () {
  const parameter = get('register');
  parameter === '?register'
    ? document.querySelector('#registerForm').classList.remove('d-none')
    : document.querySelector('#loginForm').classList.remove('d-none');
})();

function get(name) {
  if (
    (name = new RegExp('[?&]' + encodeURIComponent(name)).exec(location.search))
  )
    return decodeURIComponent(name[0]);
}

async function register() {
  if (
    document.getElementById('passwordRegister').value ===
    document.getElementById('confirmPassword').value
  ) {
    let user = {};
    user.email = document.getElementById('emailRegister').value;
    user.password = document.getElementById('passwordRegister').value;
    user.cartId = localStorage.getItem('cartToken');
    if (user.email.trim() !== '' && !validateEmail(user.email)) {
      addError(['Не подходящий email']);
      return;
    }

    const response = await fetch('/api/account/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (response.ok === true) {
      window.location.replace('index.html');
    } else {
      const errorData = await response.json();
      console.log(errorData);
      if (errorData) {
        if (errorData.errors) {
          if (errorData.errors['Email']) {
            addError(errorData.errors['Email']);
          }
          if (errorData.errors['Password']) {
            addError(errorData.errors['Password']);
          }
        }
        if (errorData['Data']) {
          addError(errorData['Data']);
        }
      }
    }
  } else {
    addError(['Пароли не совпадают']);
  }
}

async function login() {
  let user = {};
  user.email = document.getElementById('emailLogin').value;
  user.password = document.getElementById('passwordLogin').value;
  if (user.email.trim() !== '' && !validateEmail(user.email)) {
    addError(['Не подходящий email']);
    return;
  }
  const response = await fetch('/api/account/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (response.ok === true) {
    const user = await response.json();
    localStorage.setItem('cartToken', user.cartId);
    window.location.replace('index.html');
  } else {
    const errorData = await response.json();
    if (errorData) {
      if (errorData.errors) {
        if (errorData.errors['Email']) {
          addError(errorData.errors['Email']);
        }
        if (errorData.errors['Password']) {
          addError(errorData.errors['Password']);
        }
      }
      if (errorData['Data']) {
        addError(errorData['Data']);
      }
    }
  }
}

document.getElementById('submitRegister').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('errors').innerHTML = '';
  register();
});
document.getElementById('submitLogin').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('errors').innerHTML = '';
  login();
});

function addError(errors) {
  errors.forEach((error) => {
    const p = document.createElement('p');
    p.classList.add('alert', 'alert-danger');
    p.append(error);
    document.getElementById('errors').append(p);
  });
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
