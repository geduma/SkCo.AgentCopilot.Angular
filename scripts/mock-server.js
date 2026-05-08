// Triggers two calls to the Ollama cloud API (same endpoint, different content/prompt),
// then overwrites the corresponding mock JSON files on disk.
// Run: node scripts/mock-server.js  (or npm run mock-server)

const express    = require('express')
const fs         = require('fs')
const path       = require('path')
const { Ollama } = require('ollama')

const PORT        = process.env.MOCK_SERVER_PORT || 3001
const MOCKS_DIR   = path.join(__dirname, '..', 'src', 'app', 'mocks')
const PROMPTS_DIR = path.join(__dirname, '..', 'src', 'app', 'core', 'prompts')
const ENV_FILE    = path.join(__dirname, '..', 'src', 'environments', 'environment.development.ts')

// Read a value from environment.development.ts (fallback when env var is not set)
function readEnvTs (key) {
  try {
    const src = fs.readFileSync(ENV_FILE, 'utf8')
    const m   = src.match(new RegExp(`${key}:\\s*['"\`]([^'"\`]+)['"\`]`))
    return m ? m[1] : ''
  } catch { return '' }
}

const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || readEnvTs('ollamaApiKey')
const OLLAMA_HOST    = process.env.OLLAMA_HOST    || readEnvTs('ollamaHost')  || 'https://ollama.com'
const OLLAMA_MODEL   = process.env.OLLAMA_MODEL   || readEnvTs('ollamaModel') || 'minimax-m2.5:cloud'

// Single Ollama client — all chat calls go to the same https://ollama.com endpoint
const client = new Ollama({
  host:    OLLAMA_HOST,
  headers: { Authorization: `Bearer ${OLLAMA_API_KEY}` },
})

// ── helpers ───────────────────────────────────────────────────────────────────

const app = express()
app.use(express.json({ limit: '4mb' }))

function readMock (filename) {
  return JSON.parse(fs.readFileSync(path.join(MOCKS_DIR, filename), 'utf8'))
}

function writeMock (filename, data) {
  fs.writeFileSync(path.join(MOCKS_DIR, filename), JSON.stringify(data, null, 2), 'utf8')
}

function loadPrompt (filename) {
  const src = fs.readFileSync(path.join(PROMPTS_DIR, filename), 'utf8')
  const m   = src.match(/`([\s\S]*)`/)
  if (!m) throw new Error(`No template literal found in ${filename}`)
  return m[1]
}

function parseJSON (text) {
  const cleaned = text.replace(/^```(?:json)?\s*/im, '').replace(/\s*```\s*$/m, '').trim()
  return JSON.parse(cleaned)
}

// ── POST /api/generate ────────────────────────────────────────────────────────
// Makes two client.chat() calls to the same Ollama API:
//   1) customer-insights.prompt  (+products +customers data)  → customer-insights.mock.json
//   2) investment-alert.prompt                                 → critical-actions.mock.json

app.post('/api/generate', async (req, res) => {
  try {
    // ── Read source data (never modified) ─────────────────────────────────────
    const products  = readMock('products.mock.json')
    const customers = readMock('customer-insights.mock.json')

    // ── Build contents for each Ollama call ───────────────────────────────────
    const insightsContent = loadPrompt('customer-insights.prompt.ts')
      .replace('{{CLIENTES_JSON}}',  JSON.stringify(customers, null, 2))
      .replace('{{PRODUCTOS_JSON}}', JSON.stringify(products,  null, 2))

    const actionsContent = loadPrompt('investment-alert.prompt.ts')

    // ── Call 1: customer insights (same https://ollama.com endpoint) ──────────
    console.log('[1/2] Calling Ollama for customer insights...')
    const insightsRes = await client.chat({
      model:    OLLAMA_MODEL,
      messages: [{ role: 'user', content: insightsContent }],
    })

    // ── Call 2: investment alerts (same https://ollama.com endpoint) ──────────
    console.log('[2/2] Calling Ollama for investment alerts...')
    const actionsRes = await client.chat({
      model:    OLLAMA_MODEL,
      messages: [{ role: 'user', content: actionsContent }],
    })

    // ── Parse responses ───────────────────────────────────────────────────────
    const iaResults = parseJSON(insightsRes.message.content)
    const actions   = parseJSON(actionsRes.message.content)

    // ── Merge ia blocks (preserves base customer data) ────────────────────────
    const merged = customers.map(customer => {
      const entry = Array.isArray(iaResults)
        ? iaResults.find(r => Number(r.idCliente) === customer.idCliente)
        : null
      if (!entry) return customer
      const { idCliente, ...ia } = entry
      return { ...customer, ia }
    })

    // ── Overwrite both JSON files ─────────────────────────────────────────────
    writeMock('customer-insights.mock.json', merged)
    writeMock('critical-actions.mock.json',  actions)

    console.log(`Done — ${merged.length} customers, ${actions.length} actions.`)
    res.json({ success: true, customers: merged.length, actions: actions.length })

  } catch (err) {
    console.error('Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\nMock server  →  http://localhost:${PORT}`)
  console.log(`Ollama       →  ${OLLAMA_HOST}  (${OLLAMA_MODEL})`)
  console.log(`API key      →  ${OLLAMA_API_KEY ? '✓ set' : '✗ NOT SET'}`)
  console.log('\nEndpoint:  POST /api/generate\n')
})