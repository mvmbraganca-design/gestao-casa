import { useState } from 'react'
import { novoId } from '../utils.js'

export default function Tarefas({ funcionarias, tarefas, setTarefas }) {
  const [texto, setTexto] = useState('')
  const [responsavel, setResponsavel] = useState('')

  function adicionar(e) {
    e.preventDefault()
    if (!texto.trim()) return
    setTarefas([
      { id: novoId(), texto: texto.trim(), responsavel, feita: false },
      ...tarefas,
    ])
    setTexto('')
  }

  function alternar(id) {
    setTarefas(tarefas.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)))
  }

  function remover(id) {
    setTarefas(tarefas.filter((t) => t.id !== id))
  }

  function nomeResponsavel(id) {
    return funcionarias.find((f) => f.id === id)?.nome
  }

  const pendentes = tarefas.filter((t) => !t.feita).length

  return (
    <>
      <div className="header">
        <div>
          <h1>Tarefas</h1>
          <p>{pendentes} pendente(s) de {tarefas.length}</p>
        </div>
      </div>

      <form className="tarefa-input" onSubmit={adicionar}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ex.: Passar as roupas da semana"
        />
        <select value={responsavel} onChange={(e) => setResponsavel(e.target.value)}>
          <option value="">Sem responsável</option>
          {funcionarias.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Adicionar
        </button>
      </form>

      {tarefas.length === 0 ? (
        <div className="vazio">
          <span className="emoji">📝</span>
          Nenhuma tarefa por aqui. Adicione a primeira acima!
        </div>
      ) : (
        <div className="card">
          {tarefas.map((t) => (
            <div key={t.id} className={`tarefa ${t.feita ? 'feita' : ''}`}>
              <input type="checkbox" checked={t.feita} onChange={() => alternar(t.id)} />
              <div className="texto">
                {t.texto}
                {t.responsavel && nomeResponsavel(t.responsavel) && (
                  <div className="quem">👤 {nomeResponsavel(t.responsavel)}</div>
                )}
              </div>
              <button className="del-x" onClick={() => remover(t.id)} title="Remover">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
