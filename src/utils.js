// Funções utilitárias compartilhadas entre as telas.

export const FUNCOES = ['Diarista', 'Mensalista', 'Babá', 'Cozinheira', 'Jardineiro', 'Outro']

export const STATUS_DIA = {
  trabalhou: { label: 'Trabalhou', emoji: '✅', cor: '#16a34a' },
  falta: { label: 'Falta', emoji: '❌', cor: '#dc2626' },
  folga: { label: 'Folga', emoji: '🌴', cor: '#0891b2' },
}

export function formatMoeda(valor) {
  return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function novoId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// Retorna a chave do mês atual no formato "2026-06".
export function mesAtual() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// Lista de dias (objetos Date) de um determinado mês "YYYY-MM".
export function diasDoMes(chaveMes) {
  const [ano, mes] = chaveMes.split('-').map(Number)
  const total = new Date(ano, mes, 0).getDate()
  return Array.from({ length: total }, (_, i) => new Date(ano, mes - 1, i + 1))
}

export function chaveData(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function nomeMes(chaveMes) {
  const [ano, mes] = chaveMes.split('-').map(Number)
  const nome = new Date(ano, mes - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  return nome.charAt(0).toUpperCase() + nome.slice(1)
}

export function mesAnterior(chaveMes) {
  const [ano, mes] = chaveMes.split('-').map(Number)
  const d = new Date(ano, mes - 2, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function mesSeguinte(chaveMes) {
  const [ano, mes] = chaveMes.split('-').map(Number)
  const d = new Date(ano, mes, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function iniciais(nome) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}

// Cor de avatar derivada do nome (estável).
export function corAvatar(nome) {
  const cores = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ef4444']
  let soma = 0
  for (const c of nome) soma += c.charCodeAt(0)
  return cores[soma % cores.length]
}

// Dados de exemplo para a primeira execução (para a tela não nascer vazia).
export const FUNCIONARIAS_EXEMPLO = [
  { id: 'ex1', nome: 'Maria Silva', telefone: '(11) 98888-1234', funcao: 'Diarista', tipo: 'diaria', valor: 150 },
  { id: 'ex2', nome: 'Ana Souza', telefone: '(11) 97777-5678', funcao: 'Babá', tipo: 'mensal', valor: 2200 },
]
