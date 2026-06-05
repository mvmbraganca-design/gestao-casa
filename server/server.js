// Servidor local de dados para o app "Gestão da Casa".
//
// Guarda tudo num único arquivo SQLite (server/data.db). Todos os
// aparelhos conectados no mesmo Wi-Fi conversam com este servidor,
// então compartilham os mesmos dados.
//
// API (key-value com JSON): cada "coleção" do app (funcionarias,
// presenca, pagamentos, tarefas) é guardada como um registro.
//   GET  /api/state/:key   -> { value: <json> }
//   PUT  /api/state/:key   -> grava { value: <json> }

import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import express from 'express'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001

// ---- Banco de dados ----
const db = new DatabaseSync(join(__dirname, 'data.db'))
db.exec(`
  CREATE TABLE IF NOT EXISTS state (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`)

const stmtGet = db.prepare('SELECT value FROM state WHERE key = ?')
const stmtSet = db.prepare(
  'INSERT INTO state(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
)

function lerEstado(key) {
  const row = stmtGet.get(key)
  return row ? JSON.parse(row.value) : null
}

function gravarEstado(key, value) {
  stmtSet.run(key, JSON.stringify(value))
}

// Semeia funcionárias de exemplo na primeira execução (se ainda não existir).
if (lerEstado('funcionarias') === null) {
  gravarEstado('funcionarias', [
    { id: 'ex1', nome: 'Maria Silva', telefone: '(11) 98888-1234', funcao: 'Diarista', tipo: 'diaria', valor: 150 },
    { id: 'ex2', nome: 'Ana Souza', telefone: '(11) 97777-5678', funcao: 'Babá', tipo: 'mensal', valor: 2200 },
  ])
}

// ---- API ----
const app = express()
app.use(express.json({ limit: '5mb' }))

app.get('/api/state/:key', (req, res) => {
  res.json({ value: lerEstado(req.params.key) })
})

app.put('/api/state/:key', (req, res) => {
  gravarEstado(req.params.key, req.body?.value ?? null)
  res.json({ ok: true })
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, '0.0.0.0', () => {
  console.log(`📦 Servidor de dados rodando em http://localhost:${PORT}`)
  console.log(`   Banco: ${join(__dirname, 'data.db')}`)
})
