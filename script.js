// DOM Elements
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");

// Initialize transactions from local storage or set to an empty array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Save transactions to local storage
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Update UI
function updateUI() {
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = income - expenses;

  // Update DOM
  balanceEl.textContent = `N${balance.toFixed(2)}`;
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
  saveTransactions();
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

  // Add to transactions and update UI
  transactions.push({ description, amount });
  updateUI();
  transactionForm.reset();
});

// Delete Transaction
transactionList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.getAttribute("data-index");
    transactions.splice(index, 1);
    updateUI();
  }
});

// Initial UI
updateUI();
