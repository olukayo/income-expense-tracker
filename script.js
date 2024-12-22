// script.js
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");

let transactions = [];

// Update UI
function updateUI() {
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = income - expenses;

  balanceEl.textContent = balance.toFixed(2);
  incomeEl.textContent = `N${income.toFixed(2)}`;
  expensesEl.textContent = `N${expenses.toFixed(2)}`;

  transactionList.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = t.amount > 0 ? "income-item" : "expense-item";
    li.innerHTML = `
      ${t.description} <span>${t.amount > 0 ? "+" : "-"}N${Math.abs(t.amount).toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${index})">x</button>
    `;
    transactionList.appendChild(li);
  });
}

// Add Transaction
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (description && !isNaN(amount)) {
    transactions.push({ description, amount });
    updateUI();
    transactionForm.reset();
  }
});

// Delete Transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

// Initial UI
updateUI();
