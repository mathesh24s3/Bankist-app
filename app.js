const welcomeLabelEL = document.querySelector(".welcome--label");
const loginUserEl = document.querySelector(".login--user");
const loginPinEl = document.querySelector(".login--pin");
const loginBtnEl = document.querySelector(".login--btn");

const dateEl = document.querySelector(".date");
const monthEl = document.querySelector(".month");
const yearEl = document.querySelector(".year");
const balanceAmntEL = document.querySelector(".balance--amnt");

const appEl = document.querySelector("main");
const movementContainerEl = document.querySelector(".movements--container");

const transferToEl = document.querySelector(".transfer-to");
const transferAmntEl = document.querySelector(".transfer--form>.amount");
const transferBtnEl = document.querySelector(".transfer--btn");

const requestAmntEl = document.querySelector(".request--form>.amount");
const requestBtnEl = document.querySelector(".request--btn");

const confirmUserEl = document.querySelector(".confirm-user");
const confirmPinEl = document.querySelector(".confirm-pin");
const closeAccntBtnEl = document.querySelector(".close-acnt--btn");

const incomeAmntEl = document.querySelector(".income--amnt");
const outcomeAmntEl = document.querySelector(".outcome--amnt");
const interestEl = document.querySelector(".interest--amnt");

const sortBtnEl = document.querySelector(".sort--btn");

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

let currentAccnt;
let sort = false;

const d = new Date();
dateEl.textContent = d.getDate();
monthEl.textContent = d.getMonth();
yearEl.textContent = d.getFullYear();

function generateUserName(accnts) {
  accnts.forEach((acc) => {
    acc.userName = acc.owner
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toLowerCase();
  });
}

generateUserName(accounts);
console.log(accounts);

function updateMovements(movs) {
  movementContainerEl.innerHTML = "";
  movs.forEach((mov, i) => {
    const list = `<li class="movement">
        <p class="movement--type  ${
          mov > 0 ? "type--deposit" : "type--withdrawal"
        }">${i + 1} ${mov > 0 ? `DEPOSIT` : `WITHDRAWAL`}</p>
        <p class="movement--amnt ${
          mov > 0 ? "deposit" : "withdrawal"
        }">${mov}$</p>
      </li>`;
    movementContainerEl.insertAdjacentHTML("afterbegin", list);
  });
}

const currentBalance = function (movs) {
  currentAccnt.balance = movs.reduce((acc, curr) => acc + curr, 0);
  balanceAmntEL.textContent = currentAccnt.balance + "$";
};

function updateSummarry(accnt) {
  const income = accnt.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const outcome = accnt.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const interestRate = accnt.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * accnt.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  incomeAmntEl.textContent = income + "$";
  outcomeAmntEl.textContent = Math.abs(outcome) + "$";
  interestEl.textContent = interestRate + "$";
}

function logout() {
  const logout = setTimeout(() => {
    appEl.style.opacity = "0";
    currentAccnt = "";
  }, 300000);
}

function updateUI(accnt) {
  updateMovements(accnt.movements);
  currentBalance(accnt.movements);
  updateSummarry(accnt);
  logout();
}

loginBtnEl.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccnt = accounts.find(
    (acc) =>
      acc.userName === loginUserEl.value && acc.pin === Number(loginPinEl.value)
  );
  if (currentAccnt) {
    welcomeLabelEL.textContent = "Welcome, " + currentAccnt.owner;
    appEl.style.opacity = "1";
    updateUI(currentAccnt);
    loginUserEl.value = loginPinEl.value = "";
  }
});

transferBtnEl.addEventListener("click", function (e) {
  e.preventDefault();
  const transferTo = accounts.find(
    (acc) => acc.userName === transferToEl.value
  );
  const transtferAmnt = Number(transferAmntEl.value);
  if (
    transferTo &&
    currentAccnt.movements.some(
      (mov) =>
        mov >= 0.1 * transtferAmnt && transtferAmnt <= currentAccnt.balance
    )
  ) {
    transferTo.movements.push(transtferAmnt);
    currentAccnt.movements.push(-transtferAmnt);
  }

  transferAmntEl.value = transferToEl.value = "";
  updateUI(currentAccnt);
});

requestBtnEl.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmnt = Number(requestAmntEl.value);
  loanAmnt && currentAccnt.movements.push(loanAmnt);
  requestAmntEl.value = "";
  updateUI(currentAccnt);
});

closeAccntBtnEl.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    confirmUserEl.value === currentAccnt.userName &&
    Number(confirmPinEl.value === currentAccnt.pin)
  ) {
    const userIndex = accounts.findIndex(
      (acc) =>
        confirmUserEl.value === acc.userName &&
        Number(confirmPinEl.value) === acc.pin
    );
    console.log(userIndex);
    userIndex >= 0 && accounts.splice(userIndex, 1);
    confirmUserEl.value = confirmPinEl.value = "";
  }

  appEl.style.opacity = "0";
  console.log(accounts);
});

sortBtnEl.addEventListener("click", function () {
  sort = !sort;
  if (sort) {
    const movements = [...currentAccnt.movements];
    movements.sort((a, b) => a - b);
    updateMovements(movements);
    return;
  }
  updateUI(currentAccnt);
});

