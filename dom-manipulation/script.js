let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  select.innerHTML = `<option value="all">All Categories</option>`;
  [...new Set(quotes.map(q => q.category))].forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  const lastFilter = localStorage.getItem("lastCategory");
  if (lastFilter) {
    select.value = lastFilter;
    filterQuotes();
  }
}

function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }
  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes in this category.";
    return;
  }
  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" (${quote.category})`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) {
    alert("Please enter both a quote and a category!");
    return;
  }
  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  document.getElementById("quoteDisplay").innerHTML = `"${newQuote.text}" (${newQuote.category})`;
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selectedCategory);
  showRandomQuote();
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
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

// Simulated server sync
function syncWithServer() {
  // Simulate fetching from server (we use JSONPlaceholder for demo)
  fetch("https://jsonplaceholder.typicode.com/posts/1")
    .then(res => res.json())
    .then(serverData => {
      // Simulate server quote
      const serverQuote = { text: serverData.title, category: "Server" };

      // Simple conflict resolution: server data wins
      quotes = [serverQuote, ...quotes];
      saveQuotes();
      populateCategories();
      document.getElementById("syncNotice").textContent = "Synced with server — conflicts resolved!";
      setTimeout(() => {
        document.getElementById("syncNotice").textContent = "";
      }, 3000);
    })
    .catch(() => {
      document.getElementById("syncNotice").textContent = "Failed to sync with server.";
      setTimeout(() => {
        document.getElementById("syncNotice").textContent = "";
      }, 3000);
    });
}

// Set up event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

const lastViewed = sessionStorage.getItem("lastViewedQuote");
if (lastViewed) {
  const quote = JSON.parse(lastViewed);
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" (${quote.category})`;
}

// Initialize
populateCategories();

// Periodic sync every 15 seconds
setInterval(syncWithServer, 15000);
