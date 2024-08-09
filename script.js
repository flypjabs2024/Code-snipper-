const snippetList = document.getElementById("snippetList");
const snippetEditor = document.getElementById("snippetEditor");
const snippetTitle = document.getElementById("snippetTitle");
const snippetTags = document.getElementById("snippetTags");
const frameworkSelector = document.getElementById("frameworkSelector");
const snippetCode = document.getElementById("snippetCode");
const newSnippetBtn = document.getElementById("newSnippet");
const saveSnippetBtn = document.getElementById("saveSnippet");
const cancelEditBtn = document.getElementById("cancelEdit");
const toggleThemeBtn = document.getElementById("toggleTheme");

let snippets = JSON.parse(localStorage.getItem("snippets")) || [];
let editingIndex = -1;

function renderSnippets() {
  snippetList.innerHTML = "";
  snippets.forEach((snippet, index) => {
    const snippetElement = document.createElement("div");
    snippetElement.className = "snippet";
    snippetElement.innerHTML = `
      <h3>${snippet.title}</h3>
      <div class="snippet-actions">
        <button onclick="copySnippet(${index})">📋</button>
        <button onclick="editSnippet(${index})">✏️</button>
        <button onclick="deleteSnippet(${index})">🗑️</button>
        ${
          snippet.framework === "react"
            ? '<button onclick="previewSnippet(' + index + ')">👁️</button>'
            : ""
        }
      </div>
      <pre><code>${highlightSyntax(
        escapeHtml(snippet.code),
        snippet.framework
      )}</code></pre>
      <div class="tags">
        ${snippet.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
      <div>
        <img src="${getFrameworkIcon(snippet.framework)}" alt="${
      snippet.framework
    }" class="framework-icon">
        ${snippet.framework}
      </div>
    `;
    snippetList.appendChild(snippetElement);
  });
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlightSyntax(code, language) {
  const keywords = {
    javascript: [
      "function",
      "return",
      "var",
      "let",
      "const",
      "if",
      "else",
      "for",
      "while"
    ],
    html: ["div", "span", "p", "a", "img", "body", "html", "head"],
    css: [
      "body",
      "div",
      "span",
      "background",
      "color",
      "font-size",
      "margin",
      "padding"
    ],
    python: [
      "def",
      "return",
      "if",
      "elif",
      "else",
      "for",
      "while",
      "import",
      "class"
    ],
    react: [
      "function",
      "return",
      "const",
      "let",
      "var",
      "import",
      "export",
      "default",
      "props"
    ]
  };

  let highlighted = code;
  (keywords[language] || []).forEach((keyword) => {
    const regex = new RegExp("\\b" + keyword + "\\b", "g");
    highlighted = highlighted.replace(
      regex,
      `<span style="color: #569cd6;">${keyword}</span>`
    );
  });

  return highlighted;
}

function getFrameworkIcon(framework) {
  const icons = {
    javascript:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    html:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    css:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    python:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    react:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
  };
  return icons[framework] || "";
}

function saveSnippet() {
  const title = snippetTitle.value.trim();
  const tags = snippetTags.value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);
  const framework = frameworkSelector.value;
  const code = snippetCode.value.trim();

  if (title && code) {
    if (editingIndex === -1) {
      snippets.push({ title, tags, framework, code });
    } else {
      snippets[editingIndex] = { title, tags, framework, code };
      editingIndex = -1;
    }
    localStorage.setItem("snippets", JSON.stringify(snippets));
    renderSnippets();
    resetEditor();
  }
}

function editSnippet(index) {
  const snippet = snippets[index];
  snippetTitle.value = snippet.title;
  snippetTags.value = snippet.tags.join(", ");
  frameworkSelector.value = snippet.framework;
  snippetCode.value = snippet.code;
  editingIndex = index;
  snippetEditor.classList.remove("hidden");
}

function deleteSnippet(index) {
  snippets.splice(index, 1);
  localStorage.setItem("snippets", JSON.stringify(snippets));
  renderSnippets();
}

function copySnippet(index) {
  const snippet = snippets[index];
  navigator.clipboard.writeText(snippet.code);
}

function previewSnippet(index) {
  const snippet = snippets[index];
  // Implement preview logic, possibly using a modal or a new tab
}

function resetEditor() {
  snippetTitle.value = "";
  snippetTags.value = "";
  frameworkSelector.value = "javascript";
  snippetCode.value = "";
  snippetEditor.classList.add("hidden");
}

newSnippetBtn.addEventListener("click", () => {
  snippetEditor.classList.remove("hidden");
});

cancelEditBtn.addEventListener("click", resetEditor);

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

saveSnippetBtn.addEventListener("click", saveSnippet);

renderSnippets();
