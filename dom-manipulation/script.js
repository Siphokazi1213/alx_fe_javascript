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

// --- Server Simulation Variables ---
// This array simulates the data on a remote server.
// In a real application, this would be fetched from an actual API endpoint.
let serverQuotes = [
  {
    text: "The journey of a thousand miles begins with a single step.",
    category: "Inspiration",
  },
  { text: "That which does not kill us makes us stronger.", category: "Life" },
  {
    text: "The only true wisdom is in knowing you know nothing.",
    category: "Wisdom",
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    category: "Resilience",
  },
];

// Interval for periodic data syncing (e.g., every 10 seconds)
const SYNC_INTERVAL_MS = 10000; // 10 seconds

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
const notificationArea = document.createElement("div"); // Create notification div dynamically

// Append notification area to the body
document.body.insertBefore(notificationArea, document.body.firstChild);
notificationArea.id = "notificationArea";
notificationArea.style.cssText = `
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  display: none;
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

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
    showNotification(
      "Error: Could not save quotes to local storage (storage full?).",
      "error"
    );
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
      // If no local quotes, initialize with server quotes (or a subset if server is empty)
      quotes = [...serverQuotes]; // Start with server's initial data
      saveQuotes(); // Save these initial quotes to local storage
      console.log(
        "No quotes found in local storage, initialized with server defaults."
      );
    }
  } catch (e) {
    console.error("Error loading from local storage or parsing JSON:", e);
    // If parsing fails (e.g., corrupted data), reset to server defaults
    quotes = [...serverQuotes];
    saveQuotes();
    showNotification(
      "Corrupted local data. Resetting quotes to server defaults.",
      "error"
    );
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

// --- Notification System ---

/**
 * Displays a temporary notification message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - The type of notification ('success', 'error', 'info').
 */
function showNotification(message, type = "info") {
  notificationArea.textContent = message;
  notificationArea.style.display = "block";

  // Set background color based on type
  switch (type) {
    case "success":
      notificationArea.style.backgroundColor = "#d4edda";
      notificationArea.style.color = "#155724";
      notificationArea.style.border = "1px solid #c3e6cb";
      break;
    case "error":
      notificationArea.style.backgroundColor = "#f8d7da";
      notificationArea.style.color = "#721c24";
      notificationArea.style.border = "1px solid #f5c6cb";
      break;
    case "info":
    default:
      notificationArea.style.backgroundColor = "#d1ecf1";
      notificationArea.style.color = "#0c5460";
      notificationArea.style.border = "1px solid #bee5eb";
      break;
  }

  // Hide after 3 seconds
  setTimeout(() => {
    notificationArea.style.display = "none";
  }, 3000);
}

// --- Server Interaction Simulation ---

/**
 * Simulates fetching quotes from a server.
 * Returns a Promise that resolves with a copy of the serverQuotes array.
 */
function fetchQuotesFromServer() {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      console.log("Simulating fetch from server...");
      resolve([...serverQuotes]); // Return a copy to prevent direct modification
    }, 1500);
  });
}

/**
 * Simulates pushing a new quote to the server.
 * In a real app, this would be a POST request.
 * @param {object} newQuote - The quote object to "push".
 */
function pushQuoteToServer(newQuote) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate server adding the quote if it doesn't already exist (simple check)
      const exists = serverQuotes.some(
        (q) => q.text === newQuote.text && q.category === newQuote.category
      );
      if (!exists) {
        serverQuotes.push(newQuote);
        console.log("Simulated push to server:", newQuote);
        showNotification("New quote synced to server.", "success");
      } else {
        console.log("Quote already exists on server (simulated).");
      }
      resolve();
    }, 1000);
  });
}

// --- Data Syncing and Conflict Resolution ---

/**
 * Syncs local quotes with server quotes.
 * Conflict Resolution: Server data takes precedence.
 * Local-only new quotes are "pushed" to the server (simulated).
 */
async function syncDataWithServer() {
  showNotification("Syncing data with server...", "info");
  try {
    const serverData = await fetchQuotesFromServer();
    let changesDetected = false;

    // Create a map for quick lookup of server quotes
    const serverQuoteMap = new Map();
    serverData.forEach((q) => serverQuoteMap.set(`${q.text}|${q.category}`, q));

    // Create a new array for merged quotes
    let mergedQuotes = [];
    let localOnlyQuotes = [];

    // Add all server quotes to mergedQuotes (server precedence)
    serverData.forEach((q) => mergedQuotes.push(q));

    // Identify local-only quotes and add them to mergedQuotes
    quotes.forEach((localQuote) => {
      const key = `${localQuote.text}|${localQuote.category}`;
      if (!serverQuoteMap.has(key)) {
        localOnlyQuotes.push(localQuote);
        mergedQuotes.push(localQuote); // Add to merged list
        changesDetected = true;
      }
    });

    // Check if any server quotes are new to local
    if (serverData.length > quotes.length) {
      // Simple check, could be more granular
      const localQuoteMap = new Map();
      quotes.forEach((q) => localQuoteMap.set(`${q.text}|${q.category}`, q));
      serverData.forEach((serverQ) => {
        if (!localQuoteMap.has(`${serverQ.text}|${serverQ.category}`)) {
          changesDetected = true; // New server quote found
        }
      });
    }

    // Update local quotes array if changes detected or if server data is different
    const currentQuotesJson = JSON.stringify(quotes);
    const mergedQuotesJson = JSON.stringify(mergedQuotes);

    if (currentQuotesJson !== mergedQuotesJson) {
      quotes = mergedQuotes;
      saveQuotes(); // Save the merged data to local storage
      populateCategories(); // Update categories dropdown
      filterQuotes(); // Re-apply current filter
      showNotification(
        "Data synced: Local quotes updated from server.",
        "success"
      );
      console.log("Local data updated after sync. New quotes array:", quotes);
    } else {
      showNotification("Data is already up-to-date with server.", "info");
    }

    // Simulate pushing local-only quotes to the server
    for (const localOnlyQuote of localOnlyQuotes) {
      await pushQuoteToServer(localOnlyQuote); // Simulate pushing each new local quote
    }
  } catch (error) {
    console.error("Error during data sync:", error);
    showNotification("Error during data sync. Check console.", "error");
  }
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
async function addQuote() {
  const newQuoteText = newQuoteTextInput.value.trim();
  const newQuoteCategory = newQuoteCategoryInput.value.trim();

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };

    // Add to local array
    quotes.push(newQuote);
    saveQuotes(); // Save updated quotes array to local storage

    // Simulate pushing to server immediately
    await pushQuoteToServer(newQuote);

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
  showNotification("Quotes exported successfully as quotes.json!", "success");
}

/**
 * Handles importing quotes from a JSON file selected by the user.
 * Reads the file, parses JSON, and updates the quotes array and local storage.
 * @param {Event} event - The change event from the file input.
 */
async function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }

  const fileReader = new FileReader();

  fileReader.onload = async function (e) {
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

      // Add imported quotes to local array
      quotes.push(...importedQuotes);
      saveQuotes(); // Save the combined quotes to local storage

      // Simulate pushing imported quotes to server
      for (const importedQuote of importedQuotes) {
        await pushQuoteToServer(importedQuote);
      }

      populateCategories(); // Update categories dropdown after import
      showNotification("Quotes imported successfully!", "success");
      filterQuotes(); // Re-apply the current filter or show all if 'all' was selected
    } catch (error) {
      console.error("Error parsing JSON or importing quotes:", error);
      showNotification(
        "Error importing quotes. Please ensure the file is a valid JSON format.",
        "error"
      );
    } finally {
      // Clear the file input for next import
      importFile.value = "";
    }
  };

  fileReader.onerror = function () {
    alert("Error reading file.");
    console.error("FileReader error:", fileReader.error);
    showNotification("Error reading file.", "error");
  };

  fileReader.readAsText(file); // Read the file content as text
}

// --- Initial Setup and Event Listeners ---

// This ensures the DOM is fully loaded before trying to access elements
document.addEventListener("DOMContentLoaded", () => {
  // 1. Load quotes from local storage first (or initialize with server defaults)
  loadQuotes();

  // 2. Populate the category filter dropdown
  populateCategories();

  // 3. Apply the initial filter (either last saved or 'all')
  filterQuotes(); // This will also handle loading the last filter from local storage

  // 4. Attach all event listeners
  newQuoteButton.addEventListener("click", showRandomQuote);
  addQuoteButton.addEventListener("click", addQuote);
  exportQuotesButton.addEventListener("click", exportQuotes);
  importFile.addEventListener("change", importFromJsonFile);
  importQuotesButton.addEventListener("click", () => importFile.click());
  categoryFilter.addEventListener("change", filterQuotes);

  // 5. Start periodic data sync with the simulated server
  setInterval(syncDataWithServer, SYNC_INTERVAL_MS);
  showNotification("Application loaded. Syncing data periodically.", "info");
});
