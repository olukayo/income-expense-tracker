// DOM Elements
const transactionHistoryList = document.getElementById("transaction-history-list");
const monthFilter = document.getElementById("month-filter");
const yearFilter = document.getElementById("year-filter");
const backButton = document.getElementById("back-button");

// Format currency
const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

// Populate the year and month filters
function populateFilters() {
  // Clear any existing options
  monthFilter.innerHTML = "";
  yearFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Months";
  monthFilter.appendChild(allOption);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  monthNames.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = (index + 1).toString().padStart(2, "0");
    option.textContent = month;
    monthFilter.appendChild(option);
  });

  // Populate the year filter with the last 5 years and the current year
  const currentYear = new Date().getFullYear();
  for (let year = currentYear - 5; year <= currentYear; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
  }
}

// Retrieve transactions for a specific year and month from localStorage
function getTransactionsByYearMonth(year, month) {
  try {
    const key = `transactions_${year}_${month}`;
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    console.error("Error reading transactions:", error);
    return [];
  }
}

// Save transactions for a specific year and month to localStorage
function saveTransactionsByYearMonth(year, month, transactions) {
  try {
    const key = `transactions_${year}_${month}`;
    localStorage.setItem(key, JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions:", error);
  }
}

// Add a new transaction
function addTransaction(description, amount, date) {
  const transactionDate = new Date(date);
  const year = transactionDate.getFullYear();
  const month = (transactionDate.getMonth() + 1).toString().padStart(2, "0");

  const transactions = getTransactionsByYearMonth(year, month);
  const newTransaction = { description, amount, date };
  transactions.push(newTransaction);
  saveTransactionsByYearMonth(year, month, transactions);
  renderTransactions(year, month);
}

// Delete a transaction
function deleteTransaction(year, month, index) {
  const transactions = getTransactionsByYearMonth(year, month);
  transactions.splice(index, 1);
  saveTransactionsByYearMonth(year, month, transactions);
  renderTransactions(year, month);
  showFeedback("Transaction deleted!", "success");
}

// Render a single transaction element
function createTransactionElement(transaction, index, year, month) {
  const li = document.createElement("li");
  li.className = transaction.amount > 0 ? "income-item" : "expense-item";

  const amount = document.createElement("span");
  amount.textContent = `${transaction.amount > 0 ? "+" : "-"}N${Math.abs(transaction.amount).toFixed(2)}`;

  const description = document.createElement("span");
  description.textContent = transaction.description;

  const date = document.createElement("small");
  date.textContent = `(${transaction.date})`;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "x";
  deleteButton.addEventListener("click", () => deleteTransaction(year, month, index));

  li.appendChild(amount);
  li.appendChild(description);
  li.appendChild(date);
  li.appendChild(deleteButton);

  transactionHistoryList.appendChild(li);
}

// Render transaction history for the selected year and month
function renderTransactions(year, month = "all") {
  transactionHistoryList.innerHTML = ""; // Clear existing transactions

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (month === "all") {
    // Render transactions for all months in the selected year
    for (let i = 1; i <= 12; i++) {
      const monthKey = i.toString().padStart(2, "0");
      const monthTransactions = getTransactionsByYearMonth(year, monthKey);

      if (monthTransactions.length > 0) {
        const monthHeading = document.createElement("h3");
        monthHeading.textContent = `Transactions for ${monthNames[i - 1]} ${year}`;
        transactionHistoryList.appendChild(monthHeading);

        monthTransactions.forEach((t, index) => {
          createTransactionElement(t, index, year, monthKey);
        });
      }
    }
  } else {
    // Render transactions for the selected month of the selected year
    const transactions = getTransactionsByYearMonth(year, month);
    if (transactions.length > 0) {
      transactions.forEach((t, index) => {
        createTransactionElement(t, index, year, month);
      });
    } else {
      const noTransactions = document.createElement("p");
      noTransactions.textContent = "No transactions available.";
      transactionHistoryList.appendChild(noTransactions);
    }
  }
}

// Show feedback message
function showFeedback(message, type = "success") {
  const feedback = document.createElement("div");
  feedback.className = `feedback ${type}`;
  feedback.textContent = message;
  document.body.appendChild(feedback);

  setTimeout(() => feedback.remove(), 3000);
}

// Handle year and month filter changes
yearFilter.addEventListener("change", () => {
  const selectedYear = yearFilter.value;
  const selectedMonth = monthFilter.value;
  renderTransactions(selectedYear, selectedMonth);
});

monthFilter.addEventListener("change", () => {
  const selectedYear = yearFilter.value;
  const selectedMonth = monthFilter.value;
  renderTransactions(selectedYear, selectedMonth);
});

// Navigate back to the main page
backButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Initialize the application
function initializeApp() {
  populateFilters();  // Populate both the year and month filters
  const currentYear = new Date().getFullYear();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
  yearFilter.value = currentYear; // Set the filter to the current year
  monthFilter.value = currentMonth; // Set the filter to the current month
  renderTransactions(currentYear, currentMonth); // Render transactions for the current month and year
}

// Start the app
initializeApp();
