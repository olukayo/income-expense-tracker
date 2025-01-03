// ==========================
// DOM Elements
// ==========================
const yearFilter = document.getElementById("year-filter");
const monthFilter = document.getElementById("month-filter");
const transactionHistoryList = document.getElementById("transaction-history-list");
const backButton = document.getElementById("back-button");

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

// Populate year and month filters dynamically
function populateFilters() {
    const years = [...new Set(transactions.map(t => formatDate(t.date).year))];
    
    // Populate Year Filter
    yearFilter.innerHTML = years.map(year => `<option value="${year}">${year}</option>`).join("");

    // Populate Month Filter with all 12 months
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
    
    monthFilter.innerHTML = months.map(month => 
        `<option value="${month.number}">${month.name}</option>`
    ).join("");
}

// Filter transactions by selected year and month
function filterTransactions() {
    const selectedYear = parseInt(yearFilter.value);
    const selectedMonth = parseInt(monthFilter.value);

    const filteredTransactions = transactions.filter(transaction => {
        const { year, month } = formatDate(transaction.date);
        return (year === selectedYear && month === selectedMonth);
    });

    displayTransactions(filteredTransactions);
}

// Display transactions in the list
function displayTransactions(transactionsToDisplay) {
    if (transactionsToDisplay.length === 0) {
        transactionHistoryList.innerHTML = "<p>No transactions found for this period.</p>";
    } else {
        transactionHistoryList.innerHTML = transactionsToDisplay.map(transaction => {
            const { year, month, formattedMonth } = formatDate(transaction.date);
            return `
                <li>
                    <span>${transaction.description} (${formattedMonth} ${year})</span>
                    <span>${transaction.amount > 0 ? '+' : '-'}${transaction.amount}</span>
                </li>
            `;
        }).join("");
    }
}

// Back button functionality (redirect to home or previous page)
backButton.addEventListener("click", () => {
    window.history.back(); // Navigate back to the previous page
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

// Call function to add default transactions (for testing purposes)
addDefaultTransactions();

// Initialize the page
initializeTransactionHistoryPage();
