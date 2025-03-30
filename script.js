'use strict';

//Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2024-11-18T21:31:17.178Z',
    '2024-12-23T07:42:02.383Z',
    '2025-01-28T09:15:04.904Z',
    '2025-02-28T10:17:24.185Z',
    '2025-02-23T14:11:59.604Z',
    '2025-03-26T17:01:17.194Z',
    '2025-03-28T23:36:17.929Z',
    '2025-03-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2024-11-01T13:15:33.035Z',
    '2024-11-30T09:48:16.867Z',
    '2024-12-25T06:04:23.907Z',
    '2025-01-25T14:18:46.235Z',
    '2025-02-05T16:33:06.386Z',
    '2025-03-10T14:43:26.374Z',
    '2025-03-25T18:49:59.371Z',
    '2025-03-29T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-UK',
};

const accounts = [account1, account2, account3, account4];

//Elementi
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Funkcije
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); // date2-date1 daje razliku u miliseknudama, delimo sa deliocem kako bismo dobili razliku u danima
  const daysPassed = calcDaysPassed(new Date(), date); //racunamo protekle dane od prosledjenog dana do danasnjeg
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date); // formatiranje datuma po prosledjenoj lokalizaciji
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    //formatiranje brojeva prema lokalizaciji
    style: 'currency', //formatiranje kao valuta
    currency: currency,
  }).format(value); //prosledjeni broj
};

const createUsernames = function (accs) {
  //prolazi kroz listu naloga, listu korisnika, prvo pretvaramo sve u mala slova, uzimamo po rec, pravimo novi niz od prvih slova tih reci i spajamo, tako od imema i prezimena dobijamo inicijale
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

//sledece dve funkcije su poprilicno intuitivne, bitno je da znam sta map filter i reduce rade

const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce((curr, mov) => curr + mov, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const calcSummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''; //kako ne bismo imali duplikate prilikom svakog poziva funkcije

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements; //slice kopira niz kako ne bismo promenili originalni, sortira rastuce

  movs.forEach(function (mov, i) {
    const date = new Date(acc.movementsDates[i]); //uzimamo datum transakcije
    const displayDate = formatMovementDate(date, acc.locale);

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `; //kreiranje html strukture, klasa zavisi od tipa, pogledati css

    containerMovements.insertAdjacentHTML('afterbegin', html); //ubacuje html i nove elemente dodaje na pocetak, poslednja transakcija je na vrhu
  });
};

const updateUI = function (acc) {
  displayMovements(acc);
  calcBalance(acc);
  calcSummary(acc);
};

const startLogOutTimer = function () {
  let time = 120;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0); //dodaje nulu ispred broja
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time == 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
createUsernames(accounts);
let currentAccount, timer;

//Event handlers
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //kako nam se stranica ne bi odmah osvezila
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  ); //trentni kokrisnik je acc koji se nalazi u listi accounts i ako postoji sa tim username-om
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //optional chaining operator prvo proverava da li uopste imamo korisnika
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`; //uzima prvi el podeljenog niza do razmaka tj ime korisnika
    containerApp.style.opacity = 1;

    //trenutno vreme i datum
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //cistimo input polja
    inputLoginUsername.value = inputLoginPin.value = '';

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

//vecina koda je intuitivna, pratimo flowchart

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value); //uzimamo kolicinu koju zelimo da posaljemo
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  ); //uzimamo acc korisnika kojem zelimo poslati
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const request = Number(inputLoanAmount.value);
  if (
    request > 0 &&
    currentAccount.movements.some(mov => mov >= request * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(request);
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    ); //nalazimo index trenutnog naloga
    accounts.splice(index, 1); //brise element iz niza, index je index elementa, 1 je kolicina el koju zelimo da obrisemo
    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted); //razlicito od sorted, ako nije da sortira i obrnuto
  sorted = !sorted; //menja vrednost za sorted da bi pri sledecem pozivu sortirao ili vratio nesortirano
});
