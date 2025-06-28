// Load quotes from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available. Please add some!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" (${quote.category})`;

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both a quote and a category!");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();

  document.getElementById("quoteDisplay").innerHTML = `"${newText}" (${newCategory})`;

  textInput.value = "";
  categoryInput.value = "";
}

// Dynamically create form + buttons
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
    <button id="exportBtn">Export Quotes</button>
    <input type="file" id="importFile" accept=".json" />
  `;

  document.body.appendChild(formContainer);

  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
}

// Export quotes as JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Set up
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
createAddQuoteForm();

// Optionally display last viewed quote
const lastViewed = sessionStorage.getItem("lastViewedQuote");
if (lastViewed) {
  const quote = JSON.parse(lastViewed);
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" (${quote.category})`;
}
