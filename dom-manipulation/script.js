// script.js

// --- Step 2: Implement Advanced DOM Manipulation in JavaScript ---

// 1. Manage an array of quote objects
let quotes = [
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

// Get references to DOM elements
const quoteDisplayDiv = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

/**
 * Displays a random quote from the 'quotes' array in the 'quoteDisplayDiv'.
 */
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplayDiv.innerHTML = "<p>No quotes available. Add some!</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Clear previous content
  quoteDisplayDiv.innerHTML = "";

  // Create elements for the quote
  const quoteParagraph = document.createElement("p");
  quoteParagraph.textContent = `"${randomQuote.text}"`;
  quoteParagraph.style.fontStyle = "italic"; // Just for a little styling

  const categorySpan = document.createElement("span");
  categorySpan.textContent = `Category: ${randomQuote.category}`;
  categorySpan.style.fontWeight = "bold"; // Just for a little styling
  categorySpan.style.display = "block"; // Puts it on a new line

  // Append elements to the display div
  quoteDisplayDiv.appendChild(quoteParagraph);
  quoteDisplayDiv.appendChild(categorySpan);
}

/**
 * Creates and appends the form for adding new quotes to the body.
 * This function will be called once to set up the form.
 */
function createAddQuoteForm() {
  const addQuoteFormDiv = document.createElement("div");
  addQuoteFormDiv.innerHTML = `
      <h3>Add New Quote</h3>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" style="width: 300px; padding: 8px; margin-bottom: 10px;" />
      <br>
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" style="width: 200px; padding: 8px; margin-bottom: 10px;" />
      <br>
      <button id="addQuoteButton" style="padding: 10px 15px; cursor: pointer;">Add Quote</button>
    `;
  document.body.appendChild(addQuoteFormDiv);

  // Attach event listener to the dynamically created Add Quote button
  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
}

// --- Step 3: Dynamic Quote Addition ---

/**
 * Adds a new quote to the 'quotes' array and updates the display.
 */
function addQuote() {
  const newQuoteTextInput = document.getElementById("newQuoteText");
  const newQuoteCategoryInput = document.getElementById("newQuoteCategory");

  const newQuoteText = newQuoteTextInput.value.trim();
  const newQuoteCategory = newQuoteCategoryInput.value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    alert("Quote added successfully!");
    newQuoteTextInput.value = ""; // Clear the input fields
    newQuoteCategoryInput.value = ""; // Clear the input fields
    showRandomQuote(); // Optionally show a new random quote after adding
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// --- Initial Setup and Event Listeners ---

// Display an initial random quote when the page loads
document.addEventListener("DOMContentLoaded", () => {
  showRandomQuote();
  createAddQuoteForm(); // Call this to create the form when the DOM is ready
});

// Add event listener to the "Show New Quote" button
newQuoteButton.addEventListener("click", showRandomQuote);
