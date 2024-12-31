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
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = t.amount > 0 ? "income-item" : "expense-item";

    const description = document.createElement("span");
    description.textContent = `${t.description} (${t.date})`;

    const amount = document.createElement("span");
    amount.textContent = `${t.amount > 0 ? "+" : "-"}N${Math.abs(t.amount).toFixed(2)}`;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "x";
    deleteButton.setAttribute("data-index", index);

    // Attach event listener to delete button
    deleteButton.addEventListener("click", () => {
      transactions.splice(index, 1); // Remove the transaction from the array
      localStorage.setItem("transactions", JSON.stringify(transactions)); // Update localStorage
      location.reload(); // Reload the page to refresh the transaction list
    });

    li.appendChild(description);
    li.appendChild(amount);
    li.appendChild(deleteButton); // Append the delete button to the list item

    transactionHistoryList.appendChild(li);
  });
} else {
  const noTransactions = document.createElement("p");
  noTransactions.textContent = "No transactions available.";
  transactionHistoryList.appendChild(noTransactions);
}

// Navigate back to the main page
backButton.addEventListener("click", () => {
  window.location.href = "index.html";
});
