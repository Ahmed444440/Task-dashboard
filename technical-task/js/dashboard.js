import { logout } from "./auth.js";
import { getPosts, posts, createPost, updatePost } from "./store.js";

let currentPage = 1;
let pageSize = 10;
let sortColumn = "id";
let sortDirection = "asc";
let searchTerm = "";

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("logout-btn").addEventListener("click", logout);
  document.getElementById("posts-link").addEventListener("click", e => {
    e.preventDefault();
    showPostsSection();
  });
  document.getElementById("create-post-link").addEventListener("click", e => {
    e.preventDefault();
    showFormSection();
  });

  try {
    await getPosts();
    renderPostsTable();
  } catch (err) {
    document.getElementById("main-content").innerHTML = 
      `<p class="error-message">${err.message}</p>`;
  }
});

function showPostsSection() {
  document.getElementById("posts-section").style.display = "block";
  document.getElementById("form-section").style.display = "none";
  renderPostsTable();
}

function showFormSection(post = null) {
  document.getElementById("posts-section").style.display = "none";
  document.getElementById("form-section").style.display = "block";

  const formTitle = document.getElementById("form-title");
  const form = document.getElementById("post-form");
  form.reset();

  if (post) {
    formTitle.textContent = "Edit Post";
    document.getElementById("post-id").value = post.id;
    document.getElementById("title").value = post.title;
    document.getElementById("body").value = post.body;
    form.querySelector("button[type='submit']").textContent = "Update";
  } else {
    formTitle.textContent = "Create Post";
    form.querySelector("button[type='submit']").textContent = "Create";
  }

  document.getElementById("cancel-btn").onclick = showPostsSection;

  form.onsubmit = e => {
    e.preventDefault();
    const id = document.getElementById("post-id").value;
    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();

    if (title.length < 3 || body.length < 10) {
      alert("Title must be ≥ 3 chars, Body ≥ 10 chars");
      return;
    }

    if (id) {
      updatePost({ id: parseInt(id), title, body });
    } else {
      createPost({ title, body });
    }
    showPostsSection();
  };
}

function renderPostsTable() {
  const tbody = document.getElementById("posts-tbody");
  const searchInput = document.getElementById("search");
  const pageSizeSelect = document.getElementById("page-size");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const pageInfo = document.getElementById("page-info");

  let filtered = posts.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filtered.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  tbody.innerHTML = paginated.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.title}</td>
      <td><button class="btn-edit" data-id="${p.id}">Edit</button></td>
    </tr>
  `).join("");

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  searchInput.oninput = e => {
    searchTerm = e.target.value;
    currentPage = 1;
    renderPostsTable();
  };


  prevBtn.onclick = () => {
    if (currentPage > 1) { currentPage--; renderPostsTable(); }
  };
  nextBtn.onclick = () => {
    if (currentPage < totalPages) { currentPage++; renderPostsTable(); }
  };

  tbody.querySelectorAll(".btn-edit").forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.dataset.id);
      const post = posts.find(p => p.id === id);
      showFormSection(post);
    };
  });
}
