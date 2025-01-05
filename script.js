// ==========================
// 🌟 DOM Elements
// ==========================
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const resetButton = document.getElementById("reset-button");
const transactionHistoryButton = document.getElementById("transaction-history");
const transactionListContainer = document.getElementById("transaction-list");
const themeButton = document.getElementById("toggle-theme");

// ==========================
// 💾 Local Storage Handling
// ==========================
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let totalBalance = parseFloat(localStorage.getItem("totalBalance")) || 0;

// Save transactions and balance to local storage
function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("totalBalance", totalBalance.toFixed(2));
}

// ==========================
// 🔧 Utility Functions
// ==========================
const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
});

// Sort transactions by date
function sortTransactions() {
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// ==========================
// 🎨 UI Update Functions
// ==========================
function updateUI() {
    // Calculate totals (without affecting totalBalance)
    const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Update display
    balanceEl.textContent = formatter.format(totalBalance); // Keep balance constant
    incomeEl.textContent = formatter.format(income);
    expensesEl.textContent = formatter.format(expenses);

    // Sort transactions and update list
    sortTransactions();
    transactionList.innerHTML = transactions.length
        ? transactions.map((transaction, index) => `
            <li class="${transaction.amount > 0 ? 'income-item' : 'expense-item'}">
                <span>${transaction.description} (${transaction.date})</span>
                <span>${transaction.amount > 0 ? '+' : '-'}${formatter.format(Math.abs(transaction.amount))}</span>
                <button class="delete-btn" data-index="${index}">×</button>
            </li>
        `).join('')
        : "<p>No transactions available.</p>";

    saveData();
}

// ==========================
// 📝 Event Listeners
// ==========================

// 📌 Add Transaction
transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const dateInput = document.getElementById("date").value || new Date().toISOString().split("T")[0];

    // Capture current time in HH:MM AM/PM format
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    if (!description || isNaN(amount) || amount === 0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    // Update totalBalance
    totalBalance += amount;

    // Add the new transaction
    transactions.push({ description, amount, date: dateInput, time });

    // Save the updated data
    saveData();

    // Update the UI
    updateUI();

    // Reset the form
    transactionForm.reset();
});

// 📌 Delete Transaction (Balance remains unchanged)
transactionList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const index = e.target.getAttribute("data-index");
        transactions.splice(index, 1); // Remove the transaction
        updateUI(); // Refresh UI but **DO NOT** recalculate totalBalance
    }
});

// 📌 Reset Balance (Reset balance to zero)
resetButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset the balance to zero?")) {
        totalBalance = 0; // Reset the balance to zero
        transactions = []; // Optionally clear the transactions
        updateUI();
    }
});

// 📌 Toggle Transaction History Visibility
transactionHistoryButton.addEventListener("click", () => {
    if (transactionListContainer.innerHTML === "<p>No transactions available.</p>") {
        alert("No transaction history to display.");
        return;
    }
    
    transactionListContainer.style.display = transactionListContainer.style.display === "none" ? "block" : "none";
    transactionHistoryButton.textContent = transactionListContainer.style.display === "none" ? "Show Transactions" : "Hide Transactions";
});

// 📌 Toggle Theme
themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Apply saved theme on load
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

// Add loading effect before navigating
transactionHistoryButton.addEventListener("click", () => {
    transactionHistoryButton.textContent = "Loading Transactions...";
    setTimeout(() => {
        window.location.href = "transaction.html";  // Navigate after 0.5s delay
    }, 500); 
});

// ==========================
// 🚀 Initialization
// ==========================
function initializeTransactionList() {
    if (transactions.length === 0) {
        transactionListContainer.innerHTML = "<p>No transactions available.</p>"; // Provide feedback when empty
    }
}

initializeTransactionList();
updateUI();
