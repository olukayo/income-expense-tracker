// DOM Elements
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const resetButton = document.getElementById("reset-button");
const history = document.getElementById("transaction-history");

// Initialize from local storage or set default values
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let totalBalance = parseFloat(localStorage.getItem("totalBalance")) || 0;

// Sort transactions by date
transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

// Save transactions and balance to local storage
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("totalBalance", totalBalance.toFixed(2));
}

// Update UI
// Update the updateUI function
function updateUI() {
  const income = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  balanceEl.textContent = formatter.format(totalBalance);
  incomeEl.textContent = formatter.format(income);
  expensesEl.textContent = formatter.format(expenses);

  // Clear and update transaction list
  transactionList.innerHTML = '';
  
  transactions.forEach((transaction, index) => {
    const li = document.createElement("li");
    li.className = transaction.amount > 0 ? "income-item" : "expense-item";
    li.innerHTML = `
      <span>${transaction.description} (${transaction.date})</span>
      <span>${transaction.amount > 0 ? "+" : "-"}${formatter.format(Math.abs(transaction.amount))}</span>
      <button class="delete-btn" data-index="${index}">×</button>
    `;
    transactionList.appendChild(li);
  });

  saveData();
}

// Update form submission
// Update the updateUI function
function updateUI() {
  const income = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  balanceEl.textContent = formatter.format(totalBalance);
  incomeEl.textContent = formatter.format(income);
  expensesEl.textContent = formatter.format(expenses);

  // Clear and update transaction list
  transactionList.innerHTML = '';
  
  transactions.forEach((transaction, index) => {
    const li = document.createElement("li");
    li.className = transaction.amount > 0 ? "income-item" : "expense-item";
    li.innerHTML = `
      <span>${transaction.description} (${transaction.date})</span>
      <span>${transaction.amount > 0 ? "+" : "-"}${formatter.format(Math.abs(transaction.amount))}</span>
      <button class="delete-btn" data-index="${index}">×</button>
    `;
    transactionList.appendChild(li);
  });

  saveData();
}

// Update form submission
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value || new Date().toISOString().split("T")[0];

  if (description && !isNaN(amount)) {
    const transaction = {
      description,
      amount,
      date
    };

    transactions.push(transaction);
    totalBalance += amount;
    
    updateUI();
    transactionForm.reset();
  }
});

// DOM Elements
const transactionHistoryButton = document.getElementById("transaction-history");
const transactionListContainer = document.getElementById("transaction-list");

// Toggle Transaction History Visibility


transactionHistoryButton.addEventListener("click", () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  renderTransactions(currentYear, "all");
});

// Initialize UI
function initializeTransactionList() {
  if (transactions.length === 0) {
    transactionListContainer.style.display = "none"; // Hide if no transactions exist
    transactionHistoryButton.textContent = "Transaction History";
  }
}

// Call initialize function when the page loads
initializeTransactionList();

// DOM Elements





// Populate the transaction list
if (transactions.length > 0) {
  transactions.forEach((t) => {
    const li = document.createElement("li");
    li.className = t.amount > 0 ? "income-item" : "expense-item";
    li.innerHTML = `
      <span>${t.description} (${t.date})</span>
      <span>${t.amount > 0 ? "+" : "-"}N${Math.abs(t.amount).toFixed(2)}</span>
    `;
    transactionList.appendChild(li);
  });
} else {
  transactionList.innerHTML = "<p>No transactions available.</p>";
}


// Add Transaction
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value || new Date().toISOString().split("T")[0];

  if (!description) {
    alert("Description cannot be empty.");
    return;
  }
  if (isNaN(amount)) {
    alert("Please enter a valid number for the amount.");
    return;
  }

  // Use the addTransaction function instead of directly pushing to transactions array
  addTransaction(description, amount, date);
  
  // Update UI and reset form
  updateUI();
  transactionForm.reset();
});

// Delete Transaction
transactionList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.getAttribute("data-index");
    transactions.splice(index, 1); // Remove the transaction
    totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0); // Recalculate total balance
    updateUI();
  }
});

// Reset Balance Function
function resetBalance() {
  if (confirm("Are you sure you want to reset all data?")) {
    totalBalance = 0; // Reset balance to 0
    transactions = []; // Clear all transactions
    updateUI(); // Update the UI
  }
}

// Attach the reset function to the reset button
resetButton.addEventListener("click", resetBalance);

// Currency Formatter
const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

// Initialize UI
updateUI();
