import { useState } from 'react'
import { FUNCOES, formatMoeda, novoId, iniciais, corAvatar } from '../utils.js'

const VAZIO = { nome: '', telefone: '', funcao: 'Diarista', tipo: 'diaria', valor: '' }

export default function Funcionarias({ funcionarias, setFuncionarias }) {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(VAZIO)
  const [editandoId, setEditandoId] = useState(null)

  function abrirNova() {
    setForm(VAZIO)
    setEditandoId(null)
    setModalAberto(true)
  }

  function abrirEdicao(f) {
    setForm({ ...f, valor: String(f.valor) })
    setEditandoId(f.id)
    setModalAberto(true)
  }

  function salvar(e) {
    e.preventDefault()
    if (!form.nome.trim()) return
    const dados = { ...form, valor: Number(form.valor) || 0 }
    if (editandoId) {
      setFuncionarias(funcionarias.map((f) => (f.id === editandoId ? { ...dados, id: editandoId } : f)))
    } else {
      setFuncionarias([...funcionarias, { ...dados, id: novoId() }])
    }
    setModalAberto(false)
  }

  function remover(id) {
    if (confirm('Remover esta funcionária?')) {
      setFuncionarias(funcionarias.filter((f) => f.id !== id))
    }
  }

  return (
    <>
      <div className="header">
        <div>
          <h1>Funcionárias</h1>
          <p>{funcionarias.length} cadastrada(s)</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNova}>
          + Adicionar
        </button>
      </div>

      {funcionarias.length === 0 ? (
        <div className="vazio">
          <span className="emoji">👥</span>
          Nenhuma funcionária cadastrada ainda.
          <br />
          Clique em “Adicionar” para começar.
        </div>
      ) : (
        <div className="grid">
          {funcionarias.map((f) => (
            <div key={f.id} className="card func-card">
              <div className="func-top">
                <div className="avatar" style={{ background: corAvatar(f.nome) }}>
                  {iniciais(f.nome)}
                </div>
                <div>
                  <div className="nome">{f.nome}</div>
                  <span className="tag">{f.funcao}</span>
                </div>
              </div>
              <div className="func-info">
                {f.telefone && <span>📞 {f.telefone}</span>}
                <span>
                  💵 {formatMoeda(f.valor)} {f.tipo === 'diaria' ? '/ dia' : '/ mês'}
                </span>
              </div>
              <div className="func-acoes">
                <button className="btn btn-ghost btn-sm" onClick={() => abrirEdicao(f)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => remover(f.id)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAberto && (
        <div className="overlay" onClick={() => setModalAberto(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={salvar}>
            <h2>{editandoId ? 'Editar funcionária' : 'Nova funcionária'}</h2>

            <div className="campo">
              <label>Nome</label>
              <input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex.: Maria Silva"
                autoFocus
              />
            </div>

            <div className="campo">
              <label>Telefone</label>
              <input
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="campo">
              <label>Função</label>
              <select value={form.funcao} onChange={(e) => setForm({ ...form, funcao: e.target.value })}>
                {FUNCOES.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="linha">
              <div className="campo">
                <label>Tipo de pagamento</label>
                <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                  <option value="diaria">Por diária</option>
                  <option value="mensal">Mensal</option>
                </select>
              </div>
              <div className="campo">
                <label>Valor (R$)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: e.target.value })}
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="modal-acoes">
              <button type="button" className="btn btn-ghost" onClick={() => setModalAberto(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
