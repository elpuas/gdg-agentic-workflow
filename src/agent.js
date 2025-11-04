import fs from 'fs'
import fetch from 'node-fetch'

const context = fs.readFileSync('PROJECT_CONTEXT.md', 'utf-8')

const prompt = `
You are an AI assistant helping a developer.

Based on the following project context:

${context}

1. Suggest a useful and clear commit message.
2. Recommend one improvement for the project.
`

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

console.log('\n🔧 IA Suggestion:\n')
console.log(data.response)