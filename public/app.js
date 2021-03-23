const urlParams = new URLSearchParams(window.location.search);
const ac_token = urlParams.get("ac_token");
const rf_token = urlParams.get("rf_token");

var elements = document.querySelectorAll(".target");
console.log(document.cookie);

if (ac_token) {
  console.log("actoken" + ac_token, "rf_token" + rf_token);
}
const el_login = document.getElementById("login");
const el_logout = document.getElementById("logout");
if (el_login && ac_token) {
  document.getElementById("login").style.display = "none";
  document.getElementById("logout").style.display = "";
  getData();
}

async function getData() {
  const response = await fetch("/data");
  const data = await response.json();
  console.log(data);
  getPositions(data);
}

async function getPositions(data) {
  const number = data.accounts[0].number;
  const response = await fetch(`/positions/${number}`);
  const positions = await response.json();
  console.log(positions);
  for (item of positions.positions) {
    const row = document.createElement("tr");
    const symbol = document.createElement("td");
    const entryPrice = document.createElement("td");
    const currentPrice = document.createElement("td");
    const totalCost = document.createElement("td");
    const currentValue = document.createElement("td");

    row.append(symbol, entryPrice, currentPrice, totalCost, currentValue);
    symbol.textContent = item.symbol;
    entryPrice.textContent = item.averageEntryPrice;
    currentPrice.textContent = item.currentPrice;
    totalCost.textContent = item.totalCost;
    currentValue.textContent = item.currentMarketValue;
    document.getElementById("table").append(row);
  }
}
async function login() {
  const response = await fetch("/login");
  const data = await response.json();
  console.log(data);
}
