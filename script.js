// // Application State
// let currentUser = null;
// let books = [];
// let filteredBooks = [];
// let editingBookId = null;

// // Sample data for demonstration
// const sampleBooks = [
//   {
//     id: 1,
//     title: "The Great Gatsby",
//     author: "F. Scott Fitzgerald",
//     genre: "fiction",
//     condition: "like-new",
//     price: "Free",
//     contact: "john@email.com",
//     description: "Classic American literature in excellent condition",
//     available: true,
//     dateAdded: new Date("2024-01-15"),
//     owner: "demo_user",
//   },
//   {
//     id: 2,
//     title: "Atomic Habits",
//     author: "James Clear",
//     genre: "self-help",
//     condition: "new",
//     price: "$15",
//     contact: "sarah@email.com",
//     description: "Unopened book on building good habits",
//     available: true,
//     dateAdded: new Date("2024-01-20"),
//     owner: "demo_user",
//   },
//   {
//     id: 3,
//     title: "Dune",
//     author: "Frank Herbert",
//     genre: "sci-fi",
//     condition: "used",
//     price: "$10",
//     contact: "mike@email.com",
//     description: "Epic science fiction masterpiece",
//     available: false,
//     dateAdded: new Date("2024-01-10"),
//     owner: "other_user",
//   },
// ];

// // Initialize application
// document.addEventListener("DOMContentLoaded", function () {
//   initializeApp();
//   setupEventListeners();
//   loadBooks();
//   checkAuthState();
// });

// function initializeApp() {
//   // Load books from memory (in a real app, this would be from a database)
//   const savedBooks = JSON.parse(localStorage.getItem("books") || "[]");
//   books = savedBooks.length > 0 ? savedBooks : sampleBooks;
//   filteredBooks = [...books];
// }

// function setupEventListeners() {
//   // Navigation
//   document.querySelectorAll(".nav-link").forEach((link) => {
//     link.addEventListener("click", handleNavigation);
//   });

//   // Auth buttons
//   document
//     .getElementById("login-btn")
//     .addEventListener("click", showLoginModal);
//   document.getElementById("logout-btn").addEventListener("click", logout);

//   // Book actions
//   document
//     .getElementById("add-book-btn")
//     .addEventListener("click", showAddBookModal);
//   document
//     .getElementById("hero-add-book")
//     .addEventListener("click", showAddBookModal);

//   // Search and filters
//   document
//     .getElementById("search-btn")
//     .addEventListener("click", performSearch);
//   document
//     .getElementById("search-title")
//     .addEventListener("keyup", function (e) {
//       if (e.key === "Enter") performSearch();
//     });
//   document
//     .getElementById("search-author")
//     .addEventListener("keyup", function (e) {
//       if (e.key === "Enter") performSearch();
//     });

//   // Filter dropdowns
//   document
//     .getElementById("filter-genre")
//     .addEventListener("change", applyFilters);
//   document
//     .getElementById("filter-condition")
//     .addEventListener("change", applyFilters);
//   document
//     .getElementById("filter-price")
//     .addEventListener("change", applyFilters);
//   document
//     .getElementById("filter-availability")
//     .addEventListener("change", applyFilters);

//   // Modal controls
//   document
//     .getElementById("modal-close")
//     .addEventListener("click", closeBookModal);
//   document
//     .getElementById("cancel-btn")
//     .addEventListener("click", closeBookModal);
//   document
//     .getElementById("login-modal-close")
//     .addEventListener("click", closeLoginModal);
//   document
//     .getElementById("login-cancel-btn")
//     .addEventListener("click", closeLoginModal);
//   document
//     .getElementById("contact-modal-close")
//     .addEventListener("click", closeContactModal);

//   // Forms
//   document
//     .getElementById("book-form")
//     .addEventListener("submit", handleBookSubmit);
//   document.getElementById("login-form").addEventListener("submit", handleLogin);

//   // Close modals when clicking outside
//   document.addEventListener("click", function (e) {
//     if (e.target.classList.contains("modal")) {
//       closeAllModals();
//     }
//   });

//   // Mobile menu toggle
//   document
//     .getElementById("mobile-menu-toggle")
//     .addEventListener("click", toggleMobileMenu);
// }

// // Authentication Functions
// function checkAuthState() {
//   const savedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
//   if (savedUser) {
//     currentUser = savedUser;
//     updateAuthUI();
//   }
// }

// function showLoginModal() {
//   document.getElementById("login-modal").classList.add("active");
// }

// function closeLoginModal() {
//   document.getElementById("login-modal").classList.remove("active");
//   document.getElementById("login-form").reset();
// }

// function handleLogin(e) {
//   e.preventDefault();
//   const username = document.getElementById("username").value.trim();
//   const email = document.getElementById("email").value.trim();

//   if (username && email) {
//     currentUser = { username, email };
//     localStorage.setItem("currentUser", JSON.stringify(currentUser));
//     updateAuthUI();
//     closeLoginModal();
//     showToast("Welcome back, " + username + "!");
//   }
// }

// function logout() {
//   currentUser = null;
//   localStorage.removeItem("currentUser");
//   updateAuthUI();
//   displayBooks();
//   showToast("Logged out successfully");
// }

// function updateAuthUI() {
//   const authSection = document.getElementById("auth-section");
//   const userSection = document.getElementById("user-section");
//   const userName = document.getElementById("user-name");

//   if (currentUser) {
//     authSection.classList.add("hidden");
//     userSection.classList.remove("hidden");
//     userName.textContent = currentUser.username;
//   } else {
//     authSection.classList.remove("hidden");
//     userSection.classList.add("hidden");
//   }
// }

// // Book Management Functions
// function loadBooks() {
//   displayBooks();
// }

// function saveBooks() {
//   localStorage.setItem("books", JSON.stringify(books));
// }

// function showAddBookModal() {
//   if (!currentUser) {
//     showToast("Please log in to add books", "error");
//     showLoginModal();
//     return;
//   }

//   editingBookId = null;
//   document.getElementById("modal-title").textContent = "Add New Book";
//   document.getElementById("submit-btn").textContent = "Add Book";
//   document.getElementById("book-form").reset();
//   document.getElementById("book-modal").classList.add("active");
// }

// function showEditBookModal(bookId) {
//   const book = books.find((b) => b.id === bookId);
//   if (!book) return;

//   editingBookId = bookId;
//   document.getElementById("modal-title").textContent = "Edit Book";
//   document.getElementById("submit-btn").textContent = "Update Book";

//   // Populate form with book data
//   document.getElementById("book-title").value = book.title;
//   document.getElementById("book-author").value = book.author;
//   document.getElementById("book-genre").value = book.genre;
//   document.getElementById("book-condition").value = book.condition;
//   document.getElementById("book-price").value = book.price;
//   document.getElementById("book-contact").value = book.contact;
//   document.getElementById("book-description").value = book.description || "";

//   document.getElementById("book-modal").classList.add("active");
// }

// function closeBookModal() {
//   document.getElementById("book-modal").classList.remove("active");
//   document.getElementById("book-form").reset();
//   editingBookId = null;
// }

// function handleBookSubmit(e) {
//   e.preventDefault();

//   const bookData = {
//     title: document.getElementById("book-title").value.trim(),
//     author: document.getElementById("book-author").value.trim(),
//     genre: document.getElementById("book-genre").value,
//     condition: document.getElementById("book-condition").value,
//     price: document.getElementById("book-price").value.trim() || "Free",
//     contact: document.getElementById("book-contact").value.trim(),
//     description: document.getElementById("book-description").value.trim(),
//     available: true,
//     dateAdded: new Date(),
//     owner: currentUser.username,
//   };

//   if (editingBookId) {
//     // Update existing book
//     const bookIndex = books.findIndex((b) => b.id === editingBookId);
//     if (bookIndex !== -1) {
//       books[bookIndex] = { ...books[bookIndex], ...bookData };
//       showToast("Book updated successfully!");
//     }
//   } else {
//     // Add new book
//     bookData.id = Date.now();
//     books.unshift(bookData);
//     showToast("Book added successfully!");
//   }

//   saveBooks();
//   applyFilters();
//   closeBookModal();
// }

// function deleteBook(bookId) {
//   if (confirm("Are you sure you want to delete this book?")) {
//     books = books.filter((b) => b.id !== bookId);
//     saveBooks();
//     applyFilters();
//     showToast("Book deleted successfully");
//   }
// }

// function toggleBookAvailability(bookId) {
//   const book = books.find((b) => b.id === bookId);
//   if (book) {
//     book.available = !book.available;
//     saveBooks();
//     displayBooks();
//     showToast(`Book marked as ${book.available ? "available" : "unavailable"}`);
//   }
// }

// // Search and Filter Functions
// function performSearch() {
//   const titleQuery = document
//     .getElementById("search-title")
//     .value.trim()
//     .toLowerCase();
//   const authorQuery = document
//     .getElementById("search-author")
//     .value.trim()
//     .toLowerCase();

//   filteredBooks = books.filter((book) => {
//     const titleMatch =
//       !titleQuery || book.title.toLowerCase().includes(titleQuery);
//     const authorMatch =
//       !authorQuery || book.author.toLowerCase().includes(authorQuery);
//     return titleMatch && authorMatch;
//   });

//   applyFilters();
// }

// function applyFilters() {
//   const genreFilter = document.getElementById("filter-genre").value;
//   const conditionFilter = document.getElementById("filter-condition").value;
//   const priceFilter = document.getElementById("filter-price").value;
//   const availabilityFilter = document.getElementById(
//     "filter-availability"
//   ).value;

//   let filtered = [...filteredBooks];

//   if (genreFilter) {
//     filtered = filtered.filter((book) => book.genre === genreFilter);
//   }

//   if (conditionFilter) {
//     filtered = filtered.filter((book) => book.condition === conditionFilter);
//   }

//   if (priceFilter === "free") {
//     filtered = filtered.filter((book) => book.price.toLowerCase() === "free");
//   } else if (priceFilter === "paid") {
//     filtered = filtered.filter((book) => book.price.toLowerCase() !== "free");
//   }

//   if (availabilityFilter === "available") {
//     filtered = filtered.filter((book) => book.available);
//   } else if (availabilityFilter === "unavailable") {
//     filtered = filtered.filter((book) => !book.available);
//   }

//   displayBooks(filtered);
// }

// function clearFilters() {
//   document.getElementById("search-title").value = "";
//   document.getElementById("search-author").value = "";
//   document.getElementById("filter-genre").value = "";
//   document.getElementById("filter-condition").value = "";
//   document.getElementById("filter-price").value = "";
//   document.getElementById("filter-availability").value = "";

//   filteredBooks = [...books];
//   displayBooks();
// }

// // Display Functions
// function displayBooks(booksToShow = null) {
//   const booksGrid = document.getElementById("books-grid");
//   const emptyState = document.getElementById("empty-state");
//   const booksToDisplay = booksToShow || filteredBooks;

//   if (booksToDisplay.length === 0) {
//     booksGrid.classList.add("hidden");
//     emptyState.classList.remove("hidden");
//     return;
//   }

//   booksGrid.classList.remove("hidden");
//   emptyState.classList.add("hidden");

//   booksGrid.innerHTML = booksToDisplay
//     .map((book) => createBookCard(book))
//     .join("");

//   // Add event listeners to book cards
//   booksGrid.querySelectorAll(".book-card").forEach((card) => {
//     const bookId = parseInt(card.dataset.bookId);

//     // Contact button
//     const contactBtn = card.querySelector(".contact-btn");
//     if (contactBtn) {
//       contactBtn.addEventListener("click", () => showContactModal(bookId));
//     }

//     // Edit button
//     const editBtn = card.querySelector(".edit-btn");
//     if (editBtn) {
//       editBtn.addEventListener("click", () => showEditBookModal(bookId));
//     }

//     // Delete button
//     const deleteBtn = card.querySelector(".delete-btn");
//     if (deleteBtn) {
//       deleteBtn.addEventListener("click", () => deleteBook(bookId));
//     }

//     // Toggle availability button
//     const toggleBtn = card.querySelector(".toggle-availability-btn");
//     if (toggleBtn) {
//       toggleBtn.addEventListener("click", () => toggleBookAvailability(bookId));
//     }
//   });
// }

// function createBookCard(book) {
//   const isOwner = currentUser && book.owner === currentUser.username;
//   const priceDisplay =
//     book.price.toLowerCase() === "free" ? "Free" : book.price;
//   const priceClass = book.price.toLowerCase() === "free" ? "free" : "";

//   return `
//                 <div class="book-card fade-in" data-book-id="${book.id}">
//                     <div class="book-image">
//                         📖
//                     </div>
//                     <div class="book-content">
//                         <h3 class="book-title">${escapeHtml(book.title)}</h3>
//                         <p class="book-author">by ${escapeHtml(book.author)}</p>

//                         <div class="book-meta">
//                             <span class="book-genre">${capitalizeFirst(
//                               book.genre
//                             )}</span>
//                             <span class="book-condition">${capitalizeFirst(
//                               book.condition
//                             )}</span>
//                         </div>

//                         <div class="book-price ${priceClass}">${escapeHtml(
//     priceDisplay
//   )}</div>

//                         <div class="book-status">
//                             <div class="status-indicator ${
//                               book.available
//                                 ? "status-available"
//                                 : "status-unavailable"
//                             }"></div>
//                             <span>${
//                               book.available ? "Available" : "Unavailable"
//                             }</span>
//                         </div>

//                         <div class="book-date">
//                             Listed on ${formatDate(book.dateAdded)}
//                         </div>

//                         ${
//                           book.description
//                             ? `<p class="book-description" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">${escapeHtml(
//                                 book.description
//                               )}</p>`
//                             : ""
//                         }

//                         <div class="book-actions">
//                             ${
//                               !isOwner
//                                 ? `<button class="btn btn-primary btn-sm contact-btn">Contact Owner</button>`
//                                 : ""
//                             }
//                             ${
//                               isOwner
//                                 ? `
//                                 <button class="btn btn-secondary btn-sm edit-btn">Edit</button>
//                                 <button class="btn btn-sm toggle-availability-btn" style="background: ${
//                                   book.available
//                                     ? "var(--warning-color)"
//                                     : "var(--success-color)"
//                                 }; color: white;">
//                                     ${
//                                       book.available
//                                         ? "Mark Unavailable"
//                                         : "Mark Available"
//                                     }
//                                 </button>
//                                 <button class="btn btn-danger btn-sm delete-btn">Delete</button>
//                             `
//                                 : ""
//                             }
//                         </div>
//                     </div>
//                 </div>
//             `;
// }

// // Contact Modal Functions
// function showContactModal(bookId) {
//   const book = books.find((b) => b.id === bookId);
//   if (!book) return;

//   document.getElementById("contact-details").textContent = book.contact;
//   document.getElementById("contact-modal").classList.add("active");
// }

// function closeContactModal() {
//   document.getElementById("contact-modal").classList.remove("active");
// }

// // Navigation Functions
// function handleNavigation(e) {
//   e.preventDefault();
//   const page = e.target.dataset.page;

//   // Update active nav link
//   document.querySelectorAll(".nav-link").forEach((link) => {
//     link.classList.remove("active");
//   });
//   e.target.classList.add("active");

//   // Handle page navigation
//   switch (page) {
//     case "home":
//       filteredBooks = [...books];
//       displayBooks();
//       break;
//     case "my-books":
//       if (!currentUser) {
//         showToast("Please log in to view your books", "error");
//         showLoginModal();
//         return;
//       }
//       filteredBooks = books.filter(
//         (book) => book.owner === currentUser.username
//       );
//       displayBooks();
//       break;
//     case "about":
//       showAboutPage();
//       break;
//   }
// }

// function showAboutPage() {
//   const booksGrid = document.getElementById("books-grid");
//   const emptyState = document.getElementById("empty-state");

//   booksGrid.classList.add("hidden");
//   emptyState.classList.remove("hidden");

//   document.getElementById("empty-state").innerHTML = `
//                 <div class="empty-state-icon">📚</div>
//                 <h3>About BookExchange</h3>
//                 <div style="max-width: 600px; margin: 0 auto; text-align: left;">
//                     <p style="margin-bottom: 1rem;">BookExchange is a community platform that connects book lovers, allowing them to share, discover, and exchange books with each other.</p>

//                     <h4 style="margin: 1.5rem 0 0.5rem 0; color: var(--primary-color);">How it works:</h4>
//                     <ul style="text-align: left; margin-bottom: 1.5rem;">
//                         <li>Create an account and list books you want to share</li>
//                         <li>Browse available books from other community members</li>
//                         <li>Contact book owners directly to arrange exchanges</li>
//                         <li>Build connections with fellow book enthusiasts</li>
//                     </ul>

//                     <h4 style="margin: 1.5rem 0 0.5rem 0; color: var(--primary-color);">Features:</h4>
//                     <ul style="text-align: left;">
//                         <li>Easy book listing with detailed information</li>
//                         <li>Advanced search and filtering options</li>
//                         <li>Direct contact system between users</li>
//                         <li>Responsive design for all devices</li>
//                         <li>Simple user management system</li>
//                     </ul>
//                 </div>
//             `;
// }

// function toggleMobileMenu() {
//   const navMenu = document.querySelector(".nav-menu");
//   navMenu.style.display = navMenu.style.display === "flex" ? "none" : "flex";
// }

// // Utility Functions
// function closeAllModals() {
//   document.querySelectorAll(".modal").forEach((modal) => {
//     modal.classList.remove("active");
//   });
// }

// function showToast(message, type = "success") {
//   const toast = document.createElement("div");
//   toast.className = `toast ${type}`;
//   toast.textContent = message;

//   document.body.appendChild(toast);

//   setTimeout(() => {
//     toast.style.animation = "slideInRight 0.3s ease reverse";
//     setTimeout(() => {
//       document.body.removeChild(toast);
//     }, 300);
//   }, 3000);
// }

// function escapeHtml(text) {
//   const div = document.createElement("div");
//   div.textContent = text;
//   return div.innerHTML;
// }

// function capitalizeFirst(str) {
//   return str.charAt(0).toUpperCase() + str.slice(1);
// }

// function formatDate(date) {
//   const d = new Date(date);
//   return d.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }

// // Initialize filters on page load
// function initializeFilters() {
//   filteredBooks = [...books];
// }

// // Reset search and filters
// function resetSearchAndFilters() {
//   clearFilters();
//   initializeFilters();
//   displayBooks();
// }

// // Keyboard shortcuts
// document.addEventListener("keydown", function (e) {
//   // Escape key closes modals
//   if (e.key === "Escape") {
//     closeAllModals();
//   }

//   // Ctrl/Cmd + K opens search
//   if ((e.ctrlKey || e.metaKey) && e.key === "k") {
//     e.preventDefault();
//     document.getElementById("search-title").focus();
//   }
// });

// // Performance optimization: Debounce search input
// function debounce(func, wait) {
//   let timeout;
//   return function executedFunction(...args) {
//     const later = () => {
//       clearTimeout(timeout);
//       func(...args);
//     };
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   };
// }

// // Add debounced search to title and author inputs
// const debouncedSearch = debounce(performSearch, 300);
// document
//   .getElementById("search-title")
//   .addEventListener("input", debouncedSearch);
// document
//   .getElementById("search-author")
//   .addEventListener("input", debouncedSearch);
// Application State
let currentUser = null;
let books = [];
let filteredBooks = [];
let editingBookId = null;

// API Base URL - adjust this to your server path
const API_BASE = ""; // Empty if files are in same directory

// Initialize application
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  checkAuthState();
  loadBooks();
});

function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", handleNavigation);
  });

  // Auth buttons
  document
    .getElementById("login-btn")
    ?.addEventListener("click", showLoginModal);
  document
    .getElementById("signup-btn")
    ?.addEventListener("click", showSignupModal);
  document.getElementById("logout-btn")?.addEventListener("click", logout);

  // Book actions
  document
    .getElementById("add-book-btn")
    ?.addEventListener("click", showAddBookModal);
  document
    .getElementById("hero-add-book")
    ?.addEventListener("click", showAddBookModal);

  // Search and filters
  document
    .getElementById("search-btn")
    ?.addEventListener("click", performSearch);
  document
    .getElementById("search-title")
    ?.addEventListener("keyup", function (e) {
      if (e.key === "Enter") performSearch();
    });
  document
    .getElementById("search-author")
    ?.addEventListener("keyup", function (e) {
      if (e.key === "Enter") performSearch();
    });

  // Filter dropdowns
  document
    .getElementById("filter-genre")
    ?.addEventListener("change", applyFilters);
  document
    .getElementById("filter-condition")
    ?.addEventListener("change", applyFilters);
  document
    .getElementById("filter-price")
    ?.addEventListener("change", applyFilters);
  document
    .getElementById("filter-availability")
    ?.addEventListener("change", applyFilters);

  // Modal controls
  document
    .getElementById("modal-close")
    ?.addEventListener("click", closeBookModal);
  document
    .getElementById("cancel-btn")
    ?.addEventListener("click", closeBookModal);
  document
    .getElementById("login-modal-close")
    ?.addEventListener("click", closeLoginModal);
  document
    .getElementById("login-cancel-btn")
    ?.addEventListener("click", closeLoginModal);
  document
    .getElementById("signup-modal-close")
    ?.addEventListener("click", closeSignupModal);
  document
    .getElementById("signup-cancel-btn")
    ?.addEventListener("click", closeSignupModal);
  document
    .getElementById("contact-modal-close")
    ?.addEventListener("click", closeContactModal);

  // Forms
  document
    .getElementById("book-form")
    ?.addEventListener("submit", handleBookSubmit);
  document
    .getElementById("login-form")
    ?.addEventListener("submit", handleLogin);
  document
    .getElementById("signup-form")
    ?.addEventListener("submit", handleSignup);

  // Close modals when clicking outside
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal")) {
      closeAllModals();
    }
  });

  // Mobile menu toggle
  document
    .getElementById("mobile-menu-toggle")
    ?.addEventListener("click", toggleMobileMenu);

  // Debounced search
  const debouncedSearch = debounce(performSearch, 300);
  document
    .getElementById("search-title")
    ?.addEventListener("input", debouncedSearch);
  document
    .getElementById("search-author")
    ?.addEventListener("input", debouncedSearch);
}

// Authentication Functions
async function checkAuthState() {
  try {
    const response = await fetch(`${API_BASE}auth.php?action=check`);
    const data = await response.json();

    if (data.authenticated) {
      currentUser = data.user;
      updateAuthUI();
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  }
}

function showLoginModal() {
  document.getElementById("login-modal")?.classList.add("active");
}

function closeLoginModal() {
  document.getElementById("login-modal")?.classList.remove("active");
  document.getElementById("login-form")?.reset();
}

function showSignupModal() {
  document.getElementById("signup-modal")?.classList.add("active");
}

function closeSignupModal() {
  document.getElementById("signup-modal")?.classList.remove("active");
  document.getElementById("signup-form")?.reset();
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}auth.php?action=login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      currentUser = data.user;
      updateAuthUI();
      closeLoginModal();
      showToast(`Welcome back, ${currentUser.username}!`);
      loadBooks();
    } else {
      showToast(data.error || "Login failed", "error");
    }
  } catch (error) {
    console.error("Login error:", error);
    showToast("Login failed. Please try again.", "error");
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirm-password"
  ).value;

  if (!username || !email || !password || !confirmPassword) {
    showToast("Please fill in all fields", "error");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters", "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}auth.php?action=signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (data.success) {
      currentUser = data.user;
      updateAuthUI();
      closeSignupModal();
      showToast(`Welcome to BookExchange, ${currentUser.username}!`);
      loadBooks();
    } else {
      showToast(data.error || "Signup failed", "error");
    }
  } catch (error) {
    console.error("Signup error:", error);
    showToast("Signup failed. Please try again.", "error");
  }
}

async function logout() {
  try {
    await fetch(`${API_BASE}auth.php?action=logout`, { method: "POST" });
    currentUser = null;
    updateAuthUI();
    loadBooks();
    showToast("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    // Still log out locally even if server request fails
    currentUser = null;
    updateAuthUI();
    loadBooks();
  }
}

function updateAuthUI() {
  const authSection = document.getElementById("auth-section");
  const userSection = document.getElementById("user-section");
  const userName = document.getElementById("user-name");

  if (currentUser) {
    authSection?.classList.add("hidden");
    userSection?.classList.remove("hidden");
    if (userName) userName.textContent = currentUser.username;
  } else {
    authSection?.classList.remove("hidden");
    userSection?.classList.add("hidden");
  }
}

// Book Management Functions
async function loadBooks() {
  try {
    const response = await fetch(`${API_BASE}books.php?action=list`);
    const data = await response.json();

    if (data.books) {
      books = data.books;
      filteredBooks = [...books];
      displayBooks();
    }
  } catch (error) {
    console.error("Failed to load books:", error);
    showToast("Failed to load books", "error");
  }
}

function showAddBookModal() {
  if (!currentUser) {
    showToast("Please log in to add books", "error");
    showLoginModal();
    return;
  }

  editingBookId = null;
  document.getElementById("modal-title").textContent = "Add New Book";
  document.getElementById("submit-btn").textContent = "Add Book";
  document.getElementById("book-form")?.reset();
  document.getElementById("book-modal")?.classList.add("active");
}

function showEditBookModal(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;

  editingBookId = bookId;
  document.getElementById("modal-title").textContent = "Edit Book";
  document.getElementById("submit-btn").textContent = "Update Book";

  // Populate form with book data
  document.getElementById("book-title").value = book.title;
  document.getElementById("book-author").value = book.author;
  document.getElementById("book-genre").value = book.genre;
  document.getElementById("book-condition").value = book.condition;
  document.getElementById("book-price").value = book.price;
  document.getElementById("book-contact").value = book.contact;
  document.getElementById("book-description").value = book.description || "";

  document.getElementById("book-modal")?.classList.add("active");
}

function closeBookModal() {
  document.getElementById("book-modal")?.classList.remove("active");
  document.getElementById("book-form")?.reset();
  editingBookId = null;
}

async function handleBookSubmit(e) {
  e.preventDefault();

  const bookData = {
    title: document.getElementById("book-title").value.trim(),
    author: document.getElementById("book-author").value.trim(),
    genre: document.getElementById("book-genre").value,
    condition: document.getElementById("book-condition").value,
    price: document.getElementById("book-price").value.trim() || "Free",
    contact: document.getElementById("book-contact").value.trim(),
    description: document.getElementById("book-description").value.trim(),
  };

  if (!bookData.title || !bookData.author) {
    showToast("Title and author are required", "error");
    return;
  }

  try {
    let response;
    if (editingBookId) {
      // Update existing book
      bookData.id = editingBookId;
      response = await fetch(`${API_BASE}books.php?action=update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
    } else {
      // Add new book
      response = await fetch(`${API_BASE}books.php?action=add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
    }

    const data = await response.json();

    if (data.success) {
      showToast(
        editingBookId
          ? "Book updated successfully!"
          : "Book added successfully!"
      );
      closeBookModal();
      loadBooks(); // Reload books from server
    } else {
      showToast(data.error || "Failed to save book", "error");
    }
  } catch (error) {
    console.error("Book save error:", error);
    showToast("Failed to save book", "error");
  }
}

async function deleteBook(bookId) {
  if (!confirm("Are you sure you want to delete this book?")) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}books.php?action=delete&id=${bookId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (data.success) {
      showToast("Book deleted successfully");
      loadBooks(); // Reload books from server
    } else {
      showToast(data.error || "Failed to delete book", "error");
    }
  } catch (error) {
    console.error("Delete error:", error);
    showToast("Failed to delete book", "error");
  }
}

async function toggleBookAvailability(bookId) {
  try {
    const response = await fetch(
      `${API_BASE}books.php?action=toggle-availability`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: bookId }),
      }
    );

    const data = await response.json();

    if (data.success) {
      showToast(
        `Book marked as ${data.available ? "available" : "unavailable"}`
      );
      loadBooks(); // Reload books from server
    } else {
      showToast(data.error || "Failed to update availability", "error");
    }
  } catch (error) {
    console.error("Toggle availability error:", error);
    showToast("Failed to update availability", "error");
  }
}

// Search and Filter Functions
async function performSearch() {
  const titleQuery =
    document.getElementById("search-title")?.value.trim() || "";
  const authorQuery =
    document.getElementById("search-author")?.value.trim() || "";

  try {
    const params = new URLSearchParams();
    params.append("action", "list");
    if (titleQuery) params.append("title", titleQuery);
    if (authorQuery) params.append("author", authorQuery);

    // Add current filters
    const genreFilter = document.getElementById("filter-genre")?.value;
    const conditionFilter = document.getElementById("filter-condition")?.value;
    const priceFilter = document.getElementById("filter-price")?.value;
    const availabilityFilter = document.getElementById(
      "filter-availability"
    )?.value;

    if (genreFilter) params.append("genre", genreFilter);
    if (conditionFilter) params.append("condition", conditionFilter);
    if (priceFilter) params.append("price_filter", priceFilter);
    if (availabilityFilter) params.append("availability", availabilityFilter);

    const response = await fetch(`${API_BASE}books.php?${params.toString()}`);
    const data = await response.json();

    if (data.books) {
      filteredBooks = data.books;
      displayBooks(filteredBooks);
    }
  } catch (error) {
    console.error("Search error:", error);
    showToast("Search failed", "error");
  }
}

function applyFilters() {
  performSearch(); // Since we're using server-side filtering
}

function clearFilters() {
  document.getElementById("search-title").value = "";
  document.getElementById("search-author").value = "";
  document.getElementById("filter-genre").value = "";
  document.getElementById("filter-condition").value = "";
  document.getElementById("filter-price").value = "";
  document.getElementById("filter-availability").value = "";

  loadBooks(); // Reload all books
}

// Display Functions
function displayBooks(booksToShow = null) {
  const booksGrid = document.getElementById("books-grid");
  const emptyState = document.getElementById("empty-state");
  const booksToDisplay = booksToShow || filteredBooks;

  if (!booksGrid) return;

  if (booksToDisplay.length === 0) {
    booksGrid.classList.add("hidden");
    emptyState?.classList.remove("hidden");
    return;
  }

  booksGrid.classList.remove("hidden");
  emptyState?.classList.add("hidden");

  booksGrid.innerHTML = booksToDisplay
    .map((book) => createBookCard(book))
    .join("");

  // Add event listeners to book cards
  booksGrid.querySelectorAll(".book-card").forEach((card) => {
    const bookId = parseInt(card.dataset.bookId);

    // Contact button
    const contactBtn = card.querySelector(".contact-btn");
    if (contactBtn) {
      contactBtn.addEventListener("click", () => showContactModal(bookId));
    }

    // Edit button
    const editBtn = card.querySelector(".edit-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => showEditBookModal(bookId));
    }

    // Delete button
    const deleteBtn = card.querySelector(".delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => deleteBook(bookId));
    }

    // Toggle availability button
    const toggleBtn = card.querySelector(".toggle-availability-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => toggleBookAvailability(bookId));
    }
  });
}

function createBookCard(book) {
  const isOwner = currentUser && book.owner === currentUser.username;
  const priceDisplay =
    book.price.toLowerCase() === "free" ? "Free" : book.price;
  const priceClass = book.price.toLowerCase() === "free" ? "free" : "";

  return `
    <div class="book-card fade-in" data-book-id="${book.id}">
      <div class="book-image">📖</div>
      <div class="book-content">
        <h3 class="book-title">${escapeHtml(book.title)}</h3>
        <p class="book-author">by ${escapeHtml(book.author)}</p>
        
        <div class="book-meta">
          <span class="book-genre">${capitalizeFirst(book.genre)}</span>
          <span class="book-condition">${capitalizeFirst(book.condition)}</span>
        </div>
        
        <div class="book-price ${priceClass}">${escapeHtml(priceDisplay)}</div>
        
        <div class="book-status">
          <div class="status-indicator ${
            book.available ? "status-available" : "status-unavailable"
          }"></div>
          <span>${book.available ? "Available" : "Unavailable"}</span>
        </div>
        
        <div class="book-date">
          Listed on ${formatDate(book.dateAdded)}
        </div>
        
        ${
          book.description
            ? `<p class="book-description" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">${escapeHtml(
                book.description
              )}</p>`
            : ""
        }
        
        <div class="book-actions">
          ${
            !isOwner
              ? `<button class="btn btn-primary btn-sm contact-btn">Contact Owner</button>`
              : ""
          }
          ${
            isOwner
              ? `
            <button class="btn btn-secondary btn-sm edit-btn">Edit</button>
            <button class="btn btn-sm toggle-availability-btn" style="background: ${
              book.available ? "var(--warning-color)" : "var(--success-color)"
            }; color: white;">
              ${book.available ? "Mark Unavailable" : "Mark Available"}
            </button>
            <button class="btn btn-danger btn-sm delete-btn">Delete</button>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

// Contact Modal Functions
function showContactModal(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;

  document.getElementById("contact-details").textContent = book.contact;
  document.getElementById("contact-modal")?.classList.add("active");
}

function closeContactModal() {
  document.getElementById("contact-modal")?.classList.remove("active");
}

// Navigation Functions
async function handleNavigation(e) {
  e.preventDefault();
  const page = e.target.dataset.page;

  // Update active nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });
  e.target.classList.add("active");

  // Handle page navigation
  switch (page) {
    case "home":
      loadBooks();
      break;
    case "my-books":
      if (!currentUser) {
        showToast("Please log in to view your books", "error");
        showLoginModal();
        return;
      }
      try {
        const response = await fetch(`${API_BASE}books.php?action=my-books`);
        const data = await response.json();
        if (data.books) {
          filteredBooks = data.books;
          displayBooks();
        }
      } catch (error) {
        console.error("Failed to load my books:", error);
        showToast("Failed to load your books", "error");
      }
      break;
    case "about":
      showAboutPage();
      break;
  }
}

function showAboutPage() {
  const booksGrid = document.getElementById("books-grid");
  const emptyState = document.getElementById("empty-state");

  if (booksGrid) booksGrid.classList.add("hidden");
  if (emptyState) {
    emptyState.classList.remove("hidden");
    emptyState.innerHTML = `
      <div class="empty-state-icon">📚</div>
      <h3>About BookExchange</h3>
      <div style="max-width: 600px; margin: 0 auto; text-align: left;">
        <p style="margin-bottom: 1rem;">BookExchange is a community platform that connects book lovers, allowing them to share, discover, and exchange books with each other.</p>
        
        <h4 style="margin: 1.5rem 0 0.5rem 0; color: var(--primary-color);">How it works:</h4>
        <ul style="text-align: left; margin-bottom: 1.5rem;">
          <li>Create an account and list books you want to share</li>
          <li>Browse available books from other community members</li>
          <li>Contact book owners directly to arrange exchanges</li>
          <li>Build connections with fellow book enthusiasts</li>
        </ul>
        
        <h4 style="margin: 1.5rem 0 0.5rem 0; color: var(--primary-color);">Features:</h4>
        <ul style="text-align: left;">
          <li>Easy book listing with detailed information</li> 
          <li>Advanced search and filtering options</li>
          <li>Direct contact system between users</li>
          <li>Responsive design for all devices</li>
          <li>Secure user authentication system</li>
        </ul>
      </div>
    `;
  }
}

function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu");
  if (navMenu) {
    navMenu.style.display = navMenu.style.display === "flex" ? "none" : "flex";
  }
}

// Utility Functions
function closeAllModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("active");
  });
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideInRight 0.3s ease reverse";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Performance optimization: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Escape key closes modals
  if (e.key === "Escape") {
    closeAllModals();
  }

  // Ctrl/Cmd + K opens search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    document.getElementById("search-title")?.focus();
  }
});
