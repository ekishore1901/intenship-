// State Management
let notes = [];
let categories = [];
let profile = {};
let likedNotes = [];
let bookmarkedNotes = [];

let currentView = "explore";
let currentNoteId = null;
let selectedCategory = "All Categories";
let searchQuery = "";
let sortBy = "latest";
let workspaceTab = "my-notes";

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initData();
  setupTheme();
  setupEventListeners();
  routeTo(currentView);
  renderCategories();
  renderExploreFeed();
});

// Load state from localStorage or mockData
function initData() {
  // Notes
  const storedNotes = localStorage.getItem("aethernote_notes");
  if (storedNotes) {
    notes = JSON.parse(storedNotes);
  } else {
    notes = window.initialNotes || [];
    localStorage.setItem("aethernote_notes", JSON.stringify(notes));
  }

  // Categories
  categories = window.initialCategories || ["All Categories"];

  // Profile
  const storedProfile = localStorage.getItem("aethernote_profile");
  if (storedProfile) {
    profile = JSON.parse(storedProfile);
  } else {
    profile = window.defaultProfile || {
      name: "Jane Doe",
      username: "janedoe",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Computer Science student | Passionate notes compiler | AI enthusiast",
      savedNotes: ["note-1", "note-4"],
      myNotes: []
    };
    localStorage.setItem("aethernote_profile", JSON.stringify(profile));
  }
  bookmarkedNotes = profile.savedNotes || [];

  // Likes
  const storedLikes = localStorage.getItem("aethernote_likes");
  if (storedLikes) {
    likedNotes = JSON.parse(storedLikes);
  } else {
    likedNotes = [];
    localStorage.setItem("aethernote_likes", JSON.stringify(likedNotes));
  }

  updateSidebarProfile();
}

// Update UI headers / profile badges
function updateSidebarProfile() {
  const sidebarAvatar = document.getElementById("sidebar-avatar");
  const sidebarUsername = document.getElementById("sidebar-username");
  
  if (sidebarAvatar) sidebarAvatar.src = profile.avatar;
  if (sidebarUsername) sidebarUsername.textContent = profile.name;
}

// Theme handling
function setupTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const htmlTag = document.documentElement;
  const sunIcon = themeToggle.querySelector(".sun-icon");
  const moonIcon = themeToggle.querySelector(".moon-icon");

  let currentTheme = localStorage.getItem("aethernote_theme") || "dark";
  htmlTag.setAttribute("data-theme", currentTheme);
  
  if (currentTheme === "light") {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  } else {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  }

  themeToggle.addEventListener("click", () => {
    const activeTheme = htmlTag.getAttribute("data-theme");
    let newTheme = "dark";
    
    if (activeTheme === "dark") {
      newTheme = "light";
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    } else {
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    }
    
    htmlTag.setAttribute("data-theme", newTheme);
    localStorage.setItem("aethernote_theme", newTheme);
    showToast(`Switched to ${newTheme} mode`, "info");
  });
}

// Routing & View Manager
function routeTo(view, params = {}) {
  currentView = view;
  
  // Hide all sections
  document.querySelectorAll(".view-section").forEach(sec => sec.style.display = "none");
  
  // Update sidebar active link
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  
  // Show target search container logic
  const searchBar = document.getElementById("nav-search-container");
  if (view === "explore") {
    searchBar.style.visibility = "visible";
    searchBar.style.opacity = "1";
  } else {
    searchBar.style.visibility = "hidden";
    searchBar.style.opacity = "0";
  }

  const pageTitle = document.getElementById("page-title");

  switch(view) {
    case "explore":
      document.getElementById("view-explore").style.display = "block";
      document.getElementById("nav-explore").classList.add("active");
      if (pageTitle) pageTitle.textContent = "Explore Shared Notes";
      renderExploreFeed();
      break;
    case "details":
      document.getElementById("view-details").style.display = "block";
      if (pageTitle) pageTitle.textContent = "Note Reader";
      currentNoteId = params.noteId;
      renderNoteDetails(params.noteId);
      break;
    case "create":
      document.getElementById("view-create").style.display = "block";
      document.getElementById("nav-create").classList.add("active");
      if (pageTitle) pageTitle.textContent = "Draft a New Note";
      initEditorView();
      break;
    case "workspace":
      document.getElementById("view-workspace").style.display = "block";
      document.getElementById("nav-workspace").classList.add("active");
      if (pageTitle) pageTitle.textContent = `${profile.name}'s Workspace`;
      renderWorkspaceView();
      break;
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
  
  // Close mobile sidebar if open
  document.querySelector(".sidebar").classList.remove("open");
}

// Event Listeners setup
function setupEventListeners() {
  // Navigation
  document.getElementById("nav-explore").addEventListener("click", (e) => {
    e.preventDefault();
    routeTo("explore");
  });
  
  document.getElementById("nav-create").addEventListener("click", (e) => {
    e.preventDefault();
    routeTo("create");
  });
  
  document.getElementById("nav-workspace").addEventListener("click", (e) => {
    e.preventDefault();
    routeTo("workspace");
  });

  document.getElementById("sidebar-user-badge").addEventListener("click", () => {
    routeTo("workspace");
    switchWorkspaceTab("settings");
  });

  // Mobile sidebar toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const sidebar = document.querySelector(".sidebar");
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Search input
  const searchInput = document.getElementById("global-search");
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderExploreFeed();
  });

  // Sort dropdown
  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", (e) => {
    sortBy = e.target.value;
    renderExploreFeed();
  });

  // Detail View Back button
  document.getElementById("details-back-btn").addEventListener("click", () => {
    routeTo("explore");
  });

  // Details panel interactions
  document.getElementById("note-like-btn").addEventListener("click", toggleLikeCurrentNote);
  document.getElementById("note-bookmark-btn").addEventListener("click", toggleBookmarkCurrentNote);
  document.getElementById("note-share-btn").addEventListener("click", openShareModal);
  
  // Comment Form Submission
  document.getElementById("comment-form").addEventListener("submit", submitComment);

  // Note editor preview sync
  const editorContent = document.getElementById("editor-content");
  editorContent.addEventListener("input", updateLivePreview);

  // Editor Actions
  document.getElementById("editor-reset").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your current draft?")) {
      document.getElementById("editor-title").value = "";
      document.getElementById("editor-tags").value = "";
      document.getElementById("editor-description").value = "";
      editorContent.value = "";
      updateLivePreview();
    }
  });

  document.getElementById("editor-publish").addEventListener("click", publishNote);

  // Workspace Tabs
  document.getElementById("tab-my-notes").addEventListener("click", () => switchWorkspaceTab("my-notes"));
  document.getElementById("tab-bookmarks").addEventListener("click", () => switchWorkspaceTab("bookmarks"));
  document.getElementById("tab-settings").addEventListener("click", () => switchWorkspaceTab("settings"));

  // Settings profile form submission
  document.getElementById("settings-profile-form").addEventListener("submit", saveProfileSettings);

  // Modal close buttons
  document.getElementById("close-share-modal").addEventListener("click", () => {
    document.getElementById("share-modal").style.display = "none";
  });
  
  document.getElementById("copy-share-url-btn").addEventListener("click", copyShareUrl);
  
  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    const shareModal = document.getElementById("share-modal");
    if (e.target === shareModal) {
      shareModal.style.display = "none";
    }
  });
}

// RENDER EXPLORE PAGE

function renderCategories() {
  const container = document.getElementById("categories-container");
  container.innerHTML = "";
  
  categories.forEach(cat => {
    const pill = document.createElement("button");
    pill.className = `category-pill ${selectedCategory === cat ? 'active' : ''}`;
    pill.textContent = cat;
    pill.addEventListener("click", () => {
      // Toggle category selection
      document.querySelectorAll(".category-pill").forEach(el => el.classList.remove("active"));
      pill.classList.add("active");
      selectedCategory = cat;
      renderExploreFeed();
    });
    container.appendChild(pill);
  });
}

function renderExploreFeed() {
  const grid = document.getElementById("notes-grid");
  const noResults = document.getElementById("no-results");
  grid.innerHTML = "";

  // Filter notes
  let filteredNotes = notes.filter(note => {
    // Category match
    const categoryMatches = (selectedCategory === "All Categories" || note.category === selectedCategory);
    
    // Search query match (title, description, tags, author name)
    const matchesSearch = searchQuery === "" || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      note.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatches && matchesSearch;
  });

  // Sort notes
  filteredNotes.sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === "views") {
      return b.views - a.views;
    } else if (sortBy === "upvotes") {
      return b.upvotes - a.upvotes;
    }
    return 0;
  });

  if (filteredNotes.length === 0) {
    grid.style.display = "none";
    noResults.style.display = "flex";
    return;
  }

  grid.style.display = "grid";
  noResults.style.display = "none";

  filteredNotes.forEach(note => {
    const card = document.createElement("article");
    card.className = "note-card glass-panel";
    
    const tagsHtml = note.tags.map(tag => `<span class="tag-badge">#${tag}</span>`).join(" ");
    const isLiked = likedNotes.includes(note.id);
    const dateFormatted = new Date(note.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    card.innerHTML = `
      <div class="card-top">
        <div class="card-header-row">
          <span class="note-category-tag">${note.category}</span>
          <span class="note-date">${dateFormatted}</span>
        </div>
        <h3 class="card-title">${note.title}</h3>
        <p class="card-description">${note.description}</p>
      </div>
      
      <div class="card-bottom-area">
        <div class="card-tags">
          ${tagsHtml}
        </div>
        <div class="card-footer">
          <div class="card-author">
            <img src="${note.author.avatar}" alt="${note.author.name}" class="avatar-xs">
            <span class="author-name-xs">${note.author.name}</span>
          </div>
          <div class="card-stats">
            <div class="stat-item" title="Views">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>${note.views}</span>
            </div>
            <div class="stat-item ${isLiked ? 'active' : ''}" title="Upvotes">
              <svg viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              <span>${note.upvotes}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      // Don't open detail screen if clicking buttons specifically, but for now we route the entire card
      routeTo("details", { noteId: note.id });
    });

    grid.appendChild(card);
  });
}

// RENDER NOTE DETAILS VIEW

function renderNoteDetails(noteId) {
  const note = notes.find(n => n.id === noteId);
  if (!note) {
    showToast("Error loading note content", "danger");
    routeTo("explore");
    return;
  }

  // Increment simulated views once per session per note
  const sessionViewKey = `viewed_${noteId}`;
  if (!sessionStorage.getItem(sessionViewKey)) {
    note.views += 1;
    saveNotesToLocalStorage();
    sessionStorage.setItem(sessionViewKey, "true");
  }

  // Set Details Header elements
  document.getElementById("note-detail-category").textContent = note.category;
  document.getElementById("note-detail-title").textContent = note.title;
  document.getElementById("note-detail-avatar").src = note.author.avatar;
  document.getElementById("note-detail-author").textContent = note.author.name;
  
  const dateFormatted = new Date(note.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  document.getElementById("note-detail-date").textContent = `Uploaded ${dateFormatted}`;

  // Tags
  const tagsRow = document.getElementById("note-detail-tags");
  tagsRow.innerHTML = note.tags.map(tag => `<span class="note-tag">#${tag}</span>`).join("");

  // Views & Likes count
  document.getElementById("note-detail-views").textContent = note.views;
  document.getElementById("note-detail-likes").textContent = note.upvotes;
  document.getElementById("note-detail-comments-count").textContent = note.comments.length;
  
  // Interactive like states
  const likeBtn = document.getElementById("note-like-btn");
  if (likedNotes.includes(noteId)) {
    likeBtn.classList.add("active");
  } else {
    likeBtn.classList.remove("active");
  }

  // Interactive bookmark states
  const bookmarkBtn = document.getElementById("note-bookmark-btn");
  if (bookmarkedNotes.includes(noteId)) {
    bookmarkBtn.classList.add("active");
    bookmarkBtn.querySelector("span").textContent = "Bookmarked";
  } else {
    bookmarkBtn.classList.remove("active");
    bookmarkBtn.querySelector("span").textContent = "Bookmark";
  }

  // Set Content Body (Markdown parser)
  const mdArea = document.getElementById("note-detail-body");
  mdArea.innerHTML = parseMarkdown(note.content);

  // Load Author Information card
  document.getElementById("author-card-avatar").src = note.author.avatar;
  document.getElementById("author-card-name").textContent = note.author.name;
  document.getElementById("author-card-username").textContent = `@${note.author.username || 'creator'}`;
  document.getElementById("author-card-bio").textContent = note.author.bio || "No bio description provided.";

  // Downloads buttons setup
  const dlMd = document.getElementById("download-md-btn");
  const dlJson = document.getElementById("download-json-btn");
  
  // Rebind clean event listeners to prevent heap accumulation
  dlMd.onclick = () => downloadFile(note.title + ".md", note.content, "text/markdown");
  dlJson.onclick = () => downloadFile(note.title + ".json", JSON.stringify(note, null, 2), "application/json");

  // Load comments
  renderCommentsList(note);
}

function renderCommentsList(note) {
  const list = document.getElementById("comments-list");
  const count = document.getElementById("comments-count");
  list.innerHTML = "";
  
  count.textContent = note.comments.length;

  if (note.comments.length === 0) {
    list.innerHTML = `<div class="preview-placeholder">No comments yet. Be the first to start the discussion!</div>`;
    return;
  }

  note.comments.forEach(comment => {
    const item = document.createElement("div");
    item.className = "comment-item";
    
    const commentDate = new Date(comment.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    item.innerHTML = `
      <div class="comment-header">
        <img src="${comment.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=30&h=30&q=80'}" alt="" class="avatar-xs">
        <span class="comment-author-name">${comment.authorName}</span>
        <span class="comment-date">${commentDate}</span>
      </div>
      <p class="comment-body">${comment.content}</p>
    `;
    list.appendChild(item);
  });
}

function submitComment(e) {
  e.preventDefault();
  
  const textarea = document.getElementById("comment-textarea");
  const content = textarea.value.trim();
  
  if (!content) return;
  
  const note = notes.find(n => n.id === currentNoteId);
  if (!note) return;

  const newComment = {
    id: "c-" + Date.now(),
    authorName: profile.name,
    authorAvatar: profile.avatar,
    content: content,
    date: new Date().toISOString(),
    likes: 0
  };

  note.comments.push(newComment);
  saveNotesToLocalStorage();
  
  textarea.value = "";
  renderCommentsList(note);
  document.getElementById("note-detail-comments-count").textContent = note.comments.length;
  showToast("Comment posted!", "success");
}

function toggleLikeCurrentNote() {
  const note = notes.find(n => n.id === currentNoteId);
  if (!note) return;

  const index = likedNotes.indexOf(currentNoteId);
  const likeBtn = document.getElementById("note-like-btn");
  
  if (index > -1) {
    // Unlike note
    likedNotes.splice(index, 1);
    note.upvotes = Math.max(0, note.upvotes - 1);
    likeBtn.classList.remove("active");
    showToast("Removed upvote", "info");
  } else {
    // Like note
    likedNotes.push(currentNoteId);
    note.upvotes += 1;
    likeBtn.classList.add("active");
    showToast("Note upvoted!", "success");
  }

  localStorage.setItem("aethernote_likes", JSON.stringify(likedNotes));
  saveNotesToLocalStorage();
  document.getElementById("note-detail-likes").textContent = note.upvotes;
}

function toggleBookmarkCurrentNote() {
  const note = notes.find(n => n.id === currentNoteId);
  if (!note) return;

  const bookmarkBtn = document.getElementById("note-bookmark-btn");
  const index = bookmarkedNotes.indexOf(currentNoteId);
  
  if (index > -1) {
    // Remove bookmark
    bookmarkedNotes.splice(index, 1);
    bookmarkBtn.classList.remove("active");
    bookmarkBtn.querySelector("span").textContent = "Bookmark";
    showToast("Removed from bookmarks", "info");
  } else {
    // Add bookmark
    bookmarkedNotes.push(currentNoteId);
    bookmarkBtn.classList.add("active");
    bookmarkBtn.querySelector("span").textContent = "Bookmarked";
    showToast("Saved to workspace bookmarks", "success");
  }

  profile.savedNotes = bookmarkedNotes;
  localStorage.setItem("aethernote_profile", JSON.stringify(profile));
}

// Share Modal Operations
function openShareModal() {
  const modal = document.getElementById("share-modal");
  const input = document.getElementById("share-url-input");
  
  // Create mock URL
  input.value = `${window.location.origin}${window.location.pathname}?note=${currentNoteId}`;
  modal.style.display = "flex";
}

function copyShareUrl() {
  const input = document.getElementById("share-url-input");
  input.select();
  input.setSelectionRange(0, 99999); // For mobile devices
  
  navigator.clipboard.writeText(input.value)
    .then(() => {
      showToast("Link copied to clipboard!", "success");
      document.getElementById("share-modal").style.display = "none";
    })
    .catch(() => {
      showToast("Failed to copy link", "danger");
    });
}

// Download File Utilities
function downloadFile(filename, text, mimeType) {
  const element = document.createElement("a");
  const file = new Blob([text], {type: mimeType});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast(`Downloaded ${filename}`, "success");
}

// RENDER CREATE / EDIT VIEW

function initEditorView() {
  // Clear creator inputs
  document.getElementById("editor-title").value = "";
  document.getElementById("editor-tags").value = "";
  document.getElementById("editor-description").value = "";
  document.getElementById("editor-content").value = "";
  
  // Setup categories selection
  const select = document.getElementById("editor-category");
  select.innerHTML = "";
  categories.filter(c => c !== "All Categories").forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  
  updateLivePreview();
}

function updateLivePreview() {
  const title = document.getElementById("editor-title").value.trim();
  const content = document.getElementById("editor-content").value;
  const previewArea = document.getElementById("editor-preview-area");
  const wordCountBadge = document.getElementById("preview-word-count");

  // Word count calculation
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  wordCountBadge.textContent = `${wordCount} words`;

  if (!title && !content) {
    previewArea.innerHTML = `<div class="preview-placeholder">Start typing in the editor to see your note rendered live.</div>`;
    return;
  }

  let previewHtml = "";
  if (title) {
    previewHtml += `<h1 style="margin-top: 0; border-bottom: 2px solid var(--primary); padding-bottom: 12px;">${title}</h1>`;
  }
  
  if (content) {
    previewHtml += parseMarkdown(content);
  } else {
    previewHtml += `<p class="text-muted" style="font-style: italic;">No body content added yet...</p>`;
  }

  previewArea.innerHTML = previewHtml;
}

function publishNote() {
  const title = document.getElementById("editor-title").value.trim();
  const category = document.getElementById("editor-category").value;
  const description = document.getElementById("editor-description").value.trim();
  const content = document.getElementById("editor-content").value;
  const tagsInput = document.getElementById("editor-tags").value.trim();

  if (!title || !content) {
    showToast("Title and Note Content are required!", "danger");
    return;
  }

  // Split tags by comma
  const tags = tagsInput 
    ? tagsInput.split(",").map(t => t.trim().toLowerCase()).filter(t => t.length > 0)
    : ["general"];

  const newNote = {
    id: "note-" + Date.now(),
    title: title,
    description: description || "No summary provided.",
    category: category,
    tags: tags,
    content: content,
    author: {
      name: profile.name,
      username: profile.username,
      avatar: profile.avatar,
      bio: profile.bio
    },
    views: 0,
    upvotes: 0,
    downvotes: 0,
    date: new Date().toISOString(),
    comments: []
  };

  notes.push(newNote);
  saveNotesToLocalStorage();
  
  showToast("Note published successfully!", "success");
  
  // Update state structure
  if (!profile.myNotes) profile.myNotes = [];
  profile.myNotes.push(newNote.id);
  localStorage.setItem("aethernote_profile", JSON.stringify(profile));

  // Route back to explore page or workspace
  routeTo("workspace");
  switchWorkspaceTab("my-notes");
}

// RENDER WORKSPACE VIEW

function renderWorkspaceView() {
  // Profile banner
  const pAvatar = document.getElementById("workspace-profile-avatar");
  const pName = document.getElementById("workspace-profile-name");
  const pHandle = document.getElementById("workspace-profile-handle");
  const pBio = document.getElementById("workspace-profile-bio");

  pAvatar.src = profile.avatar;
  pName.textContent = profile.name;
  pHandle.textContent = `@${profile.username}`;
  pBio.textContent = profile.bio || "No biography provided.";

  // Calculate statistics
  const userNotes = notes.filter(n => n.author.username === profile.username);
  const totalViews = userNotes.reduce((sum, n) => sum + n.views, 0);

  document.getElementById("stats-uploads").textContent = userNotes.length;
  document.getElementById("stats-bookmarks").textContent = bookmarkedNotes.length;
  document.getElementById("stats-views-received").textContent = totalViews;

  renderWorkspaceNotesList();
}

function switchWorkspaceTab(tabId) {
  workspaceTab = tabId;
  
  // Set tab active styling
  document.querySelectorAll(".workspace-tab").forEach(tab => tab.classList.remove("active"));
  
  const notesGrid = document.getElementById("workspace-notes-grid");
  const settingsPanel = document.getElementById("workspace-settings-panel");
  
  notesGrid.style.display = "none";
  settingsPanel.style.display = "none";

  if (tabId === "my-notes") {
    document.getElementById("tab-my-notes").classList.add("active");
    notesGrid.style.display = "grid";
    renderWorkspaceNotesList();
  } else if (tabId === "bookmarks") {
    document.getElementById("tab-bookmarks").classList.add("active");
    notesGrid.style.display = "grid";
    renderWorkspaceNotesList();
  } else if (tabId === "settings") {
    document.getElementById("tab-settings").classList.add("active");
    settingsPanel.style.display = "block";
    initSettingsForm();
  }
}

function renderWorkspaceNotesList() {
  const grid = document.getElementById("workspace-notes-grid");
  grid.innerHTML = "";

  let list = [];
  if (workspaceTab === "my-notes") {
    list = notes.filter(n => n.author.username === profile.username);
  } else if (workspaceTab === "bookmarks") {
    list = notes.filter(n => bookmarkedNotes.includes(n.id));
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1; padding: 40px 0;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 48px; height: 48px;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h3>No notes found</h3>
        <p>${workspaceTab === "my-notes" ? "You haven't uploaded any notes yet. Click 'Create Note' to begin!" : "You haven't bookmarked any notes yet."}</p>
      </div>
    `;
    return;
  }

  list.forEach(note => {
    const card = document.createElement("article");
    card.className = "note-card glass-panel";
    
    const tagsHtml = note.tags.map(tag => `<span class="tag-badge">#${tag}</span>`).join(" ");
    const isLiked = likedNotes.includes(note.id);
    const dateFormatted = new Date(note.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    card.innerHTML = `
      <div class="card-top">
        <div class="card-header-row">
          <span class="note-category-tag">${note.category}</span>
          <span class="note-date">${dateFormatted}</span>
        </div>
        <h3 class="card-title">${note.title}</h3>
        <p class="card-description">${note.description}</p>
      </div>
      
      <div class="card-bottom-area">
        <div class="card-tags">
          ${tagsHtml}
        </div>
        <div class="card-footer">
          <div class="card-author">
            <img src="${note.author.avatar}" alt="${note.author.name}" class="avatar-xs">
            <span class="author-name-xs">${note.author.name}</span>
          </div>
          <div class="card-stats">
            <div class="stat-item" title="Views">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>${note.views}</span>
            </div>
            <div class="stat-item ${isLiked ? 'active' : ''}">
              <svg viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              <span>${note.upvotes}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      routeTo("details", { noteId: note.id });
    });

    grid.appendChild(card);
  });
}

function initSettingsForm() {
  document.getElementById("settings-name").value = profile.name;
  document.getElementById("settings-username").value = profile.username;
  document.getElementById("settings-avatar").value = profile.avatar;
  document.getElementById("settings-bio").value = profile.bio || "";
}

function saveProfileSettings(e) {
  e.preventDefault();
  
  const name = document.getElementById("settings-name").value.trim();
  const username = document.getElementById("settings-username").value.trim().replace(/\s+/g, "");
  const avatar = document.getElementById("settings-avatar").value.trim();
  const bio = document.getElementById("settings-bio").value.trim();

  if (!name || !username) {
    showToast("Name and Username are required!", "danger");
    return;
  }

  // Update profile variables
  profile.name = name;
  profile.username = username;
  profile.avatar = avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
  profile.bio = bio;

  // Sync profile author references for user's own created notes
  notes.forEach(note => {
    if (note.author.username === profile.username || note.author.name === name) {
      note.author.name = profile.name;
      note.author.avatar = profile.avatar;
      note.author.bio = profile.bio;
    }
  });

  localStorage.setItem("aethernote_profile", JSON.stringify(profile));
  saveNotesToLocalStorage();
  
  updateSidebarProfile();
  renderWorkspaceView();
  showToast("Profile settings saved!", "success");
  switchWorkspaceTab("my-notes");
}

// STORAGE UTILITIES

function saveNotesToLocalStorage() {
  localStorage.setItem("aethernote_notes", JSON.stringify(notes));
}

// TOAST SYSTEM

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let iconHtml = "";
  if (type === "success") {
    iconHtml = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 18px; height:18px; color: var(--success);">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
  } else if (type === "info") {
    iconHtml = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 18px; height:18px; color: var(--primary);">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;
  } else if (type === "danger") {
    iconHtml = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 18px; height:18px; color: var(--danger);">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `;
  }

  toast.innerHTML = `
    ${iconHtml}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Animate out and remove
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// MARKDOWN PARSER

function parseMarkdown(md) {
  if (!md) return "";
  
  // Protect block code and inline code from replacements
  const codeBlocks = [];
  let processed = md;
  
  // Replace code blocks first
  processed = processed.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const id = `__CODE_BLOCK_${codeBlocks.length}__`;
    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    codeBlocks.push(`<pre><code class="${lang ? 'language-' + lang : ''}">${escapedCode}</code></pre>`);
    return "\n" + id + "\n";
  });

  // Save placeholders for inline code
  const inlineCodes = [];
  processed = processed.replace(/`([^`\n]+)`/g, (match, code) => {
    const id = `__INLINE_CODE_${inlineCodes.length}__`;
    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    inlineCodes.push(`<code>${escapedCode}</code>`);
    return id;
  });

  // Render Math equations (LaTeX display style representation)
  processed = processed.replace(/\$\$(.*?)\$\$/gs, '<div class="math-block">$1</div>');
  processed = processed.replace(/\$([^\$\n]+)\$/g, '<span class="math-inline">$1</span>');

  // Headings
  processed = processed.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
  processed = processed.replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
  processed = processed.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  processed = processed.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  processed = processed.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  processed = processed.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Dividers
  processed = processed.replace(/^---$/gm, '<hr>');

  // Blockquotes
  processed = processed.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');

  // Bullet Lists
  processed = processed.replace(/^\s*[-*]\s+(.*?)$/gm, '<li>$1</li>');
  processed = processed.replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');

  // Ordered Lists
  processed = processed.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li class="ordered">$1</li>');
  processed = processed.replace(/((?:<li class="ordered">.*<\/li>\s*)+)/g, '<ol>$1</ol>');
  processed = processed.replace(/class="ordered"/g, '');

  // Bold and Italic
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Paragraph splits
  const blocks = processed.split(/\n{2,}/);
  processed = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    
    // Check if it's already block level HTML
    if (/^<(h[1-6]|ul|ol|blockquote|pre|hr|div|p)/i.test(trimmed)) {
      return trimmed;
    }
    
    // Check for raw placeholders
    if (trimmed.startsWith("__CODE_BLOCK_")) {
      return trimmed;
    }
    
    return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
  }).join("\n");

  // Restore code blocks
  codeBlocks.forEach((html, i) => {
    processed = processed.replace(`__CODE_BLOCK_${i}__`, html);
  });
  
  // Restore inline code
  inlineCodes.forEach((html, i) => {
    processed = processed.replace(`__INLINE_CODE_${i}__`, html);
  });

  return processed;
}
