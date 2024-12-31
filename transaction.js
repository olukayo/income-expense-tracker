// DOM Elements
const transactionHistoryList = document.getElementById("transaction-history-list");
const backButton = document.getElementById("back-button");

// Fetch transactions from localStorage
const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Format currency
const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

// Render transaction history
if (transactions.length > 0) {
  transactions.forEach((transaction) => {
    const li = document.createElement("li");
    li.className = transaction.amount > 0 ? "income-item" : "expense-item";
    li.innerHTML = `
      <span>${transaction.description} (${transaction.date})</span>
      <span>${transaction.amount > 0 ? "+" : "-"}${formatter.format(Math.abs(transaction.amount))}</span>
      
    `;
    transactionHistoryList.appendChild(li);
  });
} else {
  transactionHistoryList.innerHTML = "<p>No transactions available.</p>";
}

// Navigate back to the main page
backButton.addEventListener("click", () => {
  window.location.href = "index.html";
});
