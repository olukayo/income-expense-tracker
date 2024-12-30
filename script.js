// DOM Elements
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const resetButton = document.getElementById("reset-button"); // Assume there's a reset button in HTML
const date = document.getElementById("date").value || new Date().toISOString().split("T")[0];


// Initialize from local storage or set default values
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let totalBalance = parseFloat(localStorage.getItem("totalBalance")) || 0;


transactions.sort((a, b) => new Date(a.date) - new Date(b.date));


// Save transactions and balance to local storage
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("totalBalance", totalBalance.toFixed(2));
}

// Update UI
function updateUI() {
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Update DOM
  balanceEl.textContent = `N${totalBalance.toFixed(2)}`; // Keep balance constant
  incomeEl.textContent = `N${income.toFixed(2)}`;
  expensesEl.textContent = `N${expenses.toFixed(2)}`;

  // Update Transaction List
  transactionList.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = t.amount > 0 ? "income-item" : "expense-item";
    li.innerHTML = `
      ${t.description} <span>${t.amount > 0 ? "+" : "-"}N${Math.abs(t.amount).toFixed(2)}</span>
      <button class="delete-btn" data-index="${index}">x</button>
    `;
    transactionList.appendChild(li);
  });

  // Save to Local Storage
  saveData();
}

// Add Transaction
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);

  if (!description) {
    alert("Description cannot be empty.");
    return;
  }
  if (isNaN(amount)) {
    alert("Please enter a valid number for the amount.");
    return;
  }

  const date = new Date().toISOString().split("T")[0];

  // Update total balance and add transaction
  totalBalance += amount;
  transactions.push({ description, amount });
  updateUI();
  transactionForm.reset();
});
function updateUI() {
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Update DOM
  balanceEl.textContent = `N${totalBalance.toFixed(2)}`;
  incomeEl.textContent = `N${income.toFixed(2)}`;
  expensesEl.textContent = `N${expenses.toFixed(2)}`;

  // Update Transaction List
  transactionList.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = t.amount > 0 ? "income-item" : "expense-item";
    li.innerHTML = `
      ${t.description} <span>${t.amount > 0 ? "+" : "-"}N${Math.abs(t.amount).toFixed(2)}</span>
      <small>${t.date}</small>
      <button class="delete-btn" data-index="${index}">x</button>
    `;
    transactionList.appendChild(li);
  });

  // Save to Local Storage
  saveData();
}


// Delete Transaction
transactionList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.getAttribute("data-index");
    transactions.splice(index, 1); // Remove the transaction
    updateUI(); // Update the UI without recalculating the balance
  }
});

const formatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
});
balanceEl.textContent = formatter.format(totalBalance);


// Reset Balance Function
function resetBalance() {
  totalBalance = 0; // Reset balance to 0
  transactions = []; // Clear all transactions
  updateUI(); // Update the UI
}

// Attach the reset function to the reset button
resetButton.addEventListener("click", resetBalance);

// Initialize UI
updateUI();
