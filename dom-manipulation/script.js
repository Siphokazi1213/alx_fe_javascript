// script.js

// --- Global Variables ---
// Array to store quote objects
let quotes = [];

// Key for local storage
const LOCAL_STORAGE_QUOTES_KEY = "dynamicQuoteGeneratorQuotes";
// Key for session storage (optional: last viewed quote)
const SESSION_STORAGE_LAST_QUOTE_KEY = "lastViewedQuote";
// Key for local storage to save the last selected category filter
const LOCAL_STORAGE_LAST_FILTER_KEY = "lastSelectedCategoryFilter";

// --- DOM Element References ---
const quoteDisplayDiv = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const newQuoteTextInput = document.getElementById("newQuoteText");
const newQuoteCategoryInput = document.getElementById("newQuoteCategory");
const addQuoteButton = document.getElementById("addQuoteButton");
const exportQuotesButton = document.getElementById("exportQuotesButton");
const importFile = document.getElementById("importFile");
const importQuotesButton = document.getElementById("importQuotesButton");
const categoryFilter = document.getElementById("categoryFilter"); // New DOM reference

// --- Helper Functions for Web Storage ---

/**
 * Saves the current 'quotes' array to local storage.
 * The array is stringified to JSON before saving.
 */
function saveQuotes() {
  try {
    localStorage.setItem(LOCAL_STORAGE_QUOTES_KEY, JSON.stringify(quotes));
    console.log("Quotes saved to local storage.");
  } catch (e) {
    console.error("Error saving to local storage:", e);
    // You could display a user-friendly message here, e.g., "Storage full!"
  }
}

/**
 * Loads quotes from local storage when the application initializes.
 * If no quotes are found, it initializes with default quotes.
 * The retrieved string is parsed from JSON back into an array.
 */
function loadQuotes() {
  try {
    const storedQuotes = localStorage.getItem(LOCAL_STORAGE_QUOTES_KEY);
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
      console.log("Quotes loaded from local storage.");
    } else {
      // Initialize with default quotes if no quotes are found in local storage
      quotes = [
        {
          text: "The only way to do great work is to love what you do.",
          category: "Work",
        },
        {
          text: "Strive not to be a success, but rather to be of value.",
          category: "Life",
        },
        {
          text: "The future belongs to those who believe in the beauty of their dreams.",
          category: "Inspiration",
        },
        {
          text: "Innovation distinguishes between a leader and a follower.",
          category: "Innovation",
        },
        {
          text: "The mind is everything. What you think you become.",
          category: "Mindfulness",
        },
      ];
      saveQuotes(); // Save default quotes to local storage for the first time
      console.log(
        "No quotes found in local storage, initialized with defaults."
      );
    }
  } catch (e) {
    console.error("Error loading from local storage or parsing JSON:", e);
    // If parsing fails (e.g., corrupted data), reset to default
    quotes = [
      {
        text: "The only way to do great work is to love what you do.",
        category: "Work",
      },
      {
        text: "Strive not to be a success, but rather to be of value.",
        category: "Life",
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        category: "Inspiration",
      },
      {
        text: "Innovation distinguishes between a leader and a follower.",
        category: "Innovation",
      },
      {
        text: "The mind is everything. What you think you become.",
        category: "Mindfulness",
      },
    ];
    saveQuotes();
    alert("Corrupted data in local storage. Resetting quotes to defaults.");
  }
}

/**
 * Saves the last viewed quote to session storage.
 * This data will be cleared when the browser tab is closed.
 * @param {object} quote - The quote object to store.
 */
function saveLastViewedQuoteToSession(quote) {
  try {
    sessionStorage.setItem(
      SESSION_STORAGE_LAST_QUOTE_KEY,
      JSON.stringify(quote)
    );
    console.log("Last viewed quote saved to session storage.");
  } catch (e) {
    console.error("Error saving to session storage:", e);
  }
}

/**
 * Loads the last viewed quote from session storage.
 * @returns {object|null} The last viewed quote object, or null if not found.
 */
function loadLastViewedQuoteFromSession() {
  try {
    const storedQuote = sessionStorage.getItem(SESSION_STORAGE_LAST_QUOTE_KEY);
    if (storedQuote) {
      console.log("Last viewed quote loaded from session storage.");
      return JSON.parse(storedQuote);
    }
  } catch (e) {
    console.error("Error loading from session storage or parsing JSON:", e);
  }
  return null;
}

// --- Core Application Functions ---

/**
 * Displays a single random quote from the 'quotes' array in the 'quoteDisplayDiv'.
 * Also saves the displayed quote to session storage.
 */
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplayDiv.innerHTML =
      "<p>No quotes available. Add some or import from a file!</p>";
    saveLastViewedQuoteToSession(null); // Clear session storage if no quotes
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Clear previous content
  quoteDisplayDiv.innerHTML = "";

  // Create elements for the quote
  const quoteItemDiv = document.createElement("div");
  quoteItemDiv.classList.add("quote-item"); // Add class for styling

  const quoteParagraph = document.createElement("p");
  quoteParagraph.textContent = `"${randomQuote.text}"`;

  const categorySpan = document.createElement("span");
  categorySpan.textContent = `Category: ${randomQuote.category}`;

  quoteItemDiv.appendChild(quoteParagraph);
  quoteItemDiv.appendChild(categorySpan);
  quoteDisplayDiv.appendChild(quoteItemDiv);

  // Save this quote to session storage
  saveLastViewedQuoteToSession(randomQuote);
}

/**
 * Populates the category filter dropdown with unique categories from the quotes array.
 * Also sets the selected value based on the last saved filter.
 */
function populateCategories() {
  // Get unique categories
  const categories = [...new Set(quotes.map((quote) => quote.category))];
  categories.sort(); // Sort categories alphabetically

  // Clear existing options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add new options
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Set the dropdown to the last saved filter, or 'all'
  const lastSelectedFilter =
    localStorage.getItem(LOCAL_STORAGE_LAST_FILTER_KEY) || "all";
  categoryFilter.value = lastSelectedFilter;
}

/**
 * Displays a list of quotes in the 'quoteDisplayDiv'.
 * Used by filterQuotes to show all matching quotes.
 * @param {Array<object>} quotesToDisplay - An array of quote objects to display.
 */
function displayQuotes(quotesToDisplay) {
  quoteDisplayDiv.innerHTML = ""; // Clear previous content

  if (quotesToDisplay.length === 0) {
    quoteDisplayDiv.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  quotesToDisplay.forEach((quote) => {
    const quoteItemDiv = document.createElement("div");
    quoteItemDiv.classList.add("quote-item"); // Add class for styling

    const quoteParagraph = document.createElement("p");
    quoteParagraph.textContent = `"${quote.text}"`;

    const categorySpan = document.createElement("span");
    categorySpan.textContent = `Category: ${quote.category}`;

    quoteItemDiv.appendChild(quoteParagraph);
    quoteItemDiv.appendChild(categorySpan);
    quoteDisplayDiv.appendChild(quoteItemDiv);
  });
}

/**
 * Filters quotes based on the selected category in the dropdown.
 * Updates the display and saves the selected filter to local storage.
 */
function filterQuotes() {
  const selectedCategory = categoryFilter.value;

  // Save the selected filter to local storage
  localStorage.setItem(LOCAL_STORAGE_LAST_FILTER_KEY, selectedCategory);

  let filteredQuotes = [];
  if (selectedCategory === "all") {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(
      (quote) => quote.category === selectedCategory
    );
  }

  displayQuotes(filteredQuotes); // Display all filtered quotes
}

/**
 * Adds a new quote to the 'quotes' array, saves to local storage,
 * clears input fields, and updates the display.
 */
function addQuote() {
  const newQuoteText = newQuoteTextInput.value.trim();
  const newQuoteCategory = newQuoteCategoryInput.value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes(); // Save updated quotes array to local storage
    populateCategories(); // Update categories dropdown (in case of new category)
    alert("Quote added successfully!");
    newQuoteTextInput.value = ""; // Clear the input fields
    newQuoteCategoryInput.value = ""; // Clear the input fields
    filterQuotes(); // Re-apply the current filter to show the new quote if it matches
  } else {
    alert("Please enter both a quote and a category.");
  }
}

/**
 * Exports the current 'quotes' array to a JSON file.
 * Creates a Blob and a temporary URL for download.
 */
function exportQuotes() {
  if (quotes.length === 0) {
    alert("No quotes to export!");
    return;
  }

  const dataStr = JSON.stringify(quotes, null, 2); // null, 2 for pretty printing
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json"; // Suggested file name
  document.body.appendChild(a); // Append to body to make it clickable
  a.click(); // Programmatically click the link to trigger download
  document.body.removeChild(a); // Clean up the temporary link

  URL.revokeObjectURL(url); // Release the object URL
  alert("Quotes exported successfully as quotes.json!");
}

/**
 * Handles importing quotes from a JSON file selected by the user.
 * Reads the file, parses JSON, and updates the quotes array and local storage.
 * @param {Event} event - The change event from the file input.
 */
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }

  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      // Basic validation for imported data structure
      if (
        !Array.isArray(importedQuotes) ||
        !importedQuotes.every((q) => q.text && q.category)
      ) {
        alert(
          'Invalid JSON file format. Please ensure it is an array of objects with "text" and "category" properties.'
        );
        return;
      }

      quotes.push(...importedQuotes); // Append new quotes
      saveQuotes(); // Save the combined quotes to local storage
      populateCategories(); // Update categories dropdown after import
      alert("Quotes imported successfully!");
      filterQuotes(); // Re-apply the current filter or show all if 'all' was selected
    } catch (error) {
      console.error("Error parsing JSON or importing quotes:", error);
      alert(
        "Error importing quotes. Please ensure the file is a valid JSON format."
      );
    } finally {
      // Clear the file input for next import
      importFile.value = "";
    }
  };

  fileReader.onerror = function () {
    alert("Error reading file.");
    console.error("FileReader error:", fileReader.error);
  };

  fileReader.readAsText(file); // Read the file content as text
}

// --- Initial Setup and Event Listeners ---

// This ensures the DOM is fully loaded before trying to access elements
document.addEventListener("DOMContentLoaded", () => {
  // 1. Load quotes from local storage first
  loadQuotes();

  // 2. Populate the category filter dropdown
  populateCategories();

  // 3. Apply the initial filter (either last saved or 'all')
  filterQuotes(); // This will also handle loading the last filter from local storage

  // 4. Attach all event listeners
  newQuoteButton.addEventListener("click", showRandomQuote); // Still shows a random quote from ALL quotes
  addQuoteButton.addEventListener("click", addQuote);
  exportQuotesButton.addEventListener("click", exportQuotes);
  importFile.addEventListener("change", importFromJsonFile);
  importQuotesButton.addEventListener("click", () => importFile.click());
  categoryFilter.addEventListener("change", filterQuotes); // Listen for changes on the filter dropdown
});
