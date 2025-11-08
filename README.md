# 🧠 Agentic Workflow – GDG DevFest Pura Vida 2025

This repository captures the live demo from Alfredo “El Puas” Navas’ GDG DevFest Pura Vida 2025 workshop. It shows how to build a 100 % local-first, open-source agentic workflow that reacts to each Git commit by consulting local project context, drafting a better commit message, recommending actionable improvements, and filing a GitHub Issue automatically.

The stack stays lightweight and transparent:

- Node.js (ES Modules)
- Husky post-commit hook
- Local AI via [Ollama](https://ollama.com/)
- GitHub Issues through [Octokit](https://github.com/octokit/octokit.js)

---

## 🧩 Project layout

```
agentic-workflow/
├── .husky/
│   └── post-commit        # Runs the agent after every commit
├── src/
│   └── agent.js           # Core agent logic
├── PROJECT_CONTEXT.md     # Prompt context shared with the model
├── .env                   # GitHub token + repo name (not committed)
├── package.json
└── test.html              # Demo file used during the workshop
```

---

## ⚙️ Prerequisites

- Node.js 18+ and npm
- Git + Husky (installed via `npm run prepare`)
- [Ollama](https://ollama.com/download) running locally with a model such as `mistral`
- GitHub Personal Access Token with `repo` scopes to create issues

---

## 🚀 Installation

1. **Clone the repo and enter the folder**
   ```bash
   git clone https://github.com/elpuas/gdg-agentic-workflow.git
   cd gdg-agentic-workflow
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up Husky and make the hook executable**
   ```bash
   npm run prepare
   chmod +x .husky/post-commit
   ```
4. **Start Ollama with your preferred model**
   ```bash
   ollama run mistral
   ```
5. **Create `.env`**
   ```bash
   GITHUB_TOKEN=ghp_your_token_here
   GITHUB_REPO=your-user/your-repo
   ```

---

## 🧠 How the agent works

Every `git commit` triggers `.husky/post-commit`, which calls `node src/agent.js`. The agent:

1. Reads `PROJECT_CONTEXT.md` to understand the current project.
2. Builds a prompt and sends it to the local mistral model via Ollama’s HTTP API.
3. Prints the model’s response (suggested commit message + improvement) to the terminal.
4. Uses Octokit to raise a GitHub Issue containing the branch name and AI feedback.

If GitHub is unavailable, the script simply logs the error and keeps your commit.

---

## ✏️ Example run

```bash
echo "<h1>Hello, Agent!</h1>" > index.html
git add index.html
git commit -m "feat: create index page"
```

Terminal output:

```
🔧 IA Suggestion:

1. Commit Message: feat: create index page
2. Recommended Improvement: Add semantic tags like <main> or <footer> for better accessibility.

GitHub Issue created successfully.
```

You should now see a new Issue titled **“IA Code Review: Suggestions from latest commit”** in the configured repository.

---

## 🧪 Testing and debugging

- Run the agent directly (no Git involved):
  ```bash
  node src/agent.js
  ```
- Trigger Husky without touching files:
  ```bash
  HUSKY_DEBUG=1 git commit --allow-empty -m "hook check"
  ```

---

## 🌱 Suggested challenges

1. **Expand the context window** – Read additional files (e.g., `README.md`, `index.html`, `style.css`) before prompting the model.
2. **Offline logging** – Save AI feedback locally via `fs.writeFileSync('agent-log.md', data.response)` instead of creating GitHub Issues.
3. **Pre-commit guardrails** – Move the hook to `pre-commit` so suggestions appear before code lands.
4. **Model experiments** – Swap `mistral` for other local models (`gemma`, `llama3`, `codellama`, etc.).
5. **Richer agents** – Extend the workflow to check accessibility, surface refactor ideas, or assemble changelog drafts.

---

## 📚 Credits

Workshop delivered by Alfredo “El Puas” Navas during GDG DevFest Pura Vida 2025.

---

## 📝 License

MIT — Feel free to adapt this project as the foundation for your own intelligent, local-first workflows.
