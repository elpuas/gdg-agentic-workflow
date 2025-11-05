import fs from 'fs'
import fetch from 'node-fetch'
import { execSync } from 'child_process'
import { config } from 'dotenv'
import { Octokit } from 'octokit'

config()

const token = process.env.GITHUB_TOKEN
const repoFullName = process.env.GITHUB_REPO // e.g. "elpuas/agentic-workflow"
const [owner, repo] = repoFullName.split('/')

// Get current Git branch
function getCurrentBranch() {
	try {
		return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
	} catch {
		return 'main'
	}
}

// Read context
const context = fs.readFileSync('PROJECT_CONTEXT.md', 'utf-8')

// Build prompt
const prompt = `
You are an AI assistant helping a developer.

Based on the following project context:

${context}

1. Suggest a useful and clear commit message.
2. Recommend one improvement for the project.
`

// Call Ollama
const res = await fetch('http://localhost:11434/api/generate', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		model: 'mistral',
		prompt,
		stream: false
	})
})

const data = await res.json()

// Output to console
console.log('\n🔧 IA Suggestion:\n')
console.log(data.response)

// Create GitHub Issue
const octokit = new Octokit({ auth: token })

try {
	const branch = getCurrentBranch()
	const body = `Branch: ${branch}\n\n${data.response}`

	await octokit.rest.issues.create({
		owner,
		repo,
		title: 'IA Code Review: Suggestions from latest commit',
		body,
		labels: ['ai-review', 'agent']
	})

	console.log('\n GitHub Issue created successfully.\n')
} catch (error) {
	console.error('\n Failed to create GitHub issue:', error)
}