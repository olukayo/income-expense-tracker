// ==========================
// DOM Elements
// ==========================
const yearFilter = document.getElementById("year-filter");
const monthFilter = document.getElementById("month-filter");
const transactionHistoryList = document.getElementById("transaction-history-list");
const backButton = document.getElementById("back-button");
document.getElementById("export-csv").addEventListener("click", exportToCSV);
document.getElementById("import-csv").addEventListener("change", importFromCSV);


// Load transactions from localStorage (or use default)
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Helper function to format year and month
function formatDate(date) {
    const d = new Date(date);
    return {
        year: d.getFullYear(),
        month: d.getMonth() + 1, // Months are 0-indexed (January = 0)
        formattedMonth: d.toLocaleString("default", { month: "long" }),
    };
}



function loadData() {
    let storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    // Add default time if missing
    transactions = storedTransactions.map(t => ({
        ...t,
        time: t.time || "00:00 AM" // Set a default time for older transactions
    }));
}


// Populate year and month filters dynamically
function populateFilters() {
    const years = [...new Set(transactions.map(t => formatDate(t.date).year))];
    yearFilter.innerHTML = `<option value="">Select Year</option>` + years.map(year => `<option value="${year}">${year}</option>`).join("");

    const months = [
        { number: 1, name: 'January' },
        { number: 2, name: 'February' },
        { number: 3, name: 'March' },
        { number: 4, name: 'April' },
        { number: 5, name: 'May' },
        { number: 6, name: 'June' },
        { number: 7, name: 'July' },
        { number: 8, name: 'August' },
        { number: 9, name: 'September' },
        { number: 10, name: 'October' },
        { number: 11, name: 'November' },
        { number: 12, name: 'December' }
    ];
    monthFilter.innerHTML = `<option value="">Select Month</option>` + months.map(month => `<option value="${month.number}">${month.name}</option>`).join("");
    monthFilter.disabled = true; // ✅ Initially disable month filter
}

// ✅ Enable month filter when a year is selected
yearFilter.addEventListener("change", () => {
    monthFilter.disabled = false;
});


// ✅ Save selected filters whenever they change
    yearFilter.addEventListener("change", () => {
     localStorage.setItem("selectedYear", yearFilter.value);
     filterTransactions();
});
monthFilter.addEventListener("change", () => {
    localStorage.setItem("selectedMonth", monthFilter.value);
    filterTransactions();
});


// Filter transactions by selected year and month
function filterTransactions() {
    const selectedYear = parseInt(yearFilter.value);
    const selectedMonth = parseInt(monthFilter.value);

    const filteredTransactions = transactions.filter(transaction => {
        const { year, month } = formatDate(transaction.date);
        return (year === selectedYear && month === selectedMonth);
    });

    displayTransactions(filteredTransactions);
    function filterTransactions() {
        // Existing filtering logic...
        updateCategoryChart(); // Refresh category chart when filtering
    }
    
}



// Display transactions in the list
function displayTransactions(transactionsToDisplay) {
    if (transactionsToDisplay.length === 0) {
        transactionHistoryList.innerHTML = "<p>No transactions found for this period.</p>";
    } else {
        transactionHistoryList.innerHTML = transactionsToDisplay.map((transaction, index) => {
            const { formattedMonth, year } = formatDate(transaction.date);
            return `
                <li>
                    <span>${transaction.description} (${formattedMonth} ${year} - ${transaction.date} at ${transaction.time})</span>
                    <span>${transaction.amount > 0 ? '+' : '-'}${transaction.amount}</span>
                    <button class="edit-btn" data-index="${index}">✏️ Edit</button>
                    <button class="delete-btn" data-index="${index}">❌ Delete</button>
                </li>
            `;
        }).join("");

        // Add event listeners to delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                deleteTransaction(index);
            });
        });
    }
}

// Function to delete a transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    filterTransactions(); // Re-filter and display transactions
}

transactionHistoryList.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
        const index = e.target.getAttribute("data-index");
        const transaction = transactions[index];

        // Prompt user for new values
        const newDescription = prompt("Edit description:", transaction.description);
        const newAmount = parseFloat(prompt("Edit amount:", transaction.amount));
        const newDate = prompt("Edit date (YYYY-MM-DD):", transaction.date);
        const newTime = prompt("Edit time (HH:MM AM/PM):", transaction.time);

        if (newDescription && !isNaN(newAmount) && newDate) {
            transactions[index] = { ...transaction, description: newDescription, amount: newAmount, date: newDate, time: newTime };
            localStorage.setItem("transactions", JSON.stringify(transactions));
            updateUI();
        } else {
            alert("Invalid input. Transaction not updated.");
        }
    }
});


function updateCategoryChart() {
    const categoryTotals = {};

    transactions.forEach(transaction => {
        if (transaction.amount < 0) { // Only count expenses
            if (!categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] = 0;
            }
            categoryTotals[transaction.category] += Math.abs(transaction.amount);
        }
    });

    const ctx = document.getElementById("categoryChart").getContext("2d");
    if (window.categoryChart) window.categoryChart.destroy(); // Remove old chart

    window.categoryChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#9966ff"]
            }]
        }
    });
}



// ✅ Reset Filters Function
function resetFilters() {
    localStorage.removeItem("selectedYear");
    localStorage.removeItem("selectedMonth");
    populateFilters();
    filterTransactions();
}

// Back button functionality (redirect to home or previous page)
// Back button functionality (redirect to home page with confirmation)
backButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to return to the main page?")) {
        window.location.href = "index.html";  // Ensure it always goes back to index.html
    }
});

// Initialize the page
function initializeTransactionHistoryPage() {
    populateFilters(); // Populate the year and month filters
    yearFilter.addEventListener("change", filterTransactions);
    monthFilter.addEventListener("change", filterTransactions);

    // Initially filter and display all transactions
    filterTransactions();
}

// Manually add default transactions to localStorage (for testing)
function addDefaultTransactions() {
    if (!localStorage.getItem("transactions")) {
        const defaultTransactions = [
            {
                "description": "Salary",
                "amount": 1000,
                "date": "2025-01-03"
            },
            {
                "description": "Groceries",
                "amount": -200,
                "date": "2025-01-05"
            },
            {
                "description": "Rent",
                "amount": -500,
                "date": "2025-01-01"
            },
            {
                "description": "Freelance Project",
                "amount": 300,
                "date": "2025-01-15"
            }
        ];
        localStorage.setItem("transactions", JSON.stringify(defaultTransactions));
    }
}


// Function to export transactions as CSV
function exportToCSV() {
    if (transactions.length === 0) {
        alert("No transactions to export.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Description,Amount,Date\n";
    transactions.forEach(t => {
        csvContent += `${t.description},${t.amount},${t.date}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
}





// Function to import transactions from a CSV file
function importFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const rows = e.target.result.split("\n").slice(1); // Skip header row
        const importedTransactions = rows.map(row => {
            const [description, amount, date] = row.split(",");
            return { description, amount: parseFloat(amount), date: date.trim() };
        }).filter(t => t.description && !isNaN(t.amount) && t.date);

        transactions = transactions.concat(importedTransactions);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateUI();
    };
    reader.readAsText(file);
}




// Call function to add default transactions (for testing purposes)
addDefaultTransactions();

// Initialize the page
initializeTransactionHistoryPage();
