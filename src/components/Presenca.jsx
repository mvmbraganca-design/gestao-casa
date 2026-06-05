import { useState } from 'react'
import {
  STATUS_DIA,
  mesAtual,
  nomeMes,
  diasDoMes,
  chaveData,
  mesAnterior,
  mesSeguinte,
  iniciais,
  corAvatar,
} from '../utils.js'

// Ciclo de status ao clicar numa célula: vazio -> trabalhou -> falta -> folga -> vazio
const CICLO = ['', 'trabalhou', 'falta', 'folga']

export default function Presenca({ funcionarias, presenca, setPresenca }) {
  const [mes, setMes] = useState(mesAtual())
  const dias = diasDoMes(mes)

  function statusDe(funcId, dataKey) {
    return presenca?.[funcId]?.[dataKey] || ''
  }

  function alternar(funcId, dataKey) {
    const atual = statusDe(funcId, dataKey)
    const proximo = CICLO[(CICLO.indexOf(atual) + 1) % CICLO.length]
    setPresenca((prev) => {
      const doFunc = { ...(prev[funcId] || {}) }
      if (proximo) doFunc[dataKey] = proximo
      else delete doFunc[dataKey]
      return { ...prev, [funcId]: doFunc }
    })
  }

  return (
    <>
      <div className="header">
        <div>
          <h1>Presença</h1>
          <p>Clique nos dias para marcar. Cada clique alterna o status.</p>
        </div>
      </div>

      <div className="mes-nav">
        <button onClick={() => setMes(mesAnterior(mes))}>‹</button>
        <div className="mes-nome">{nomeMes(mes)}</div>
        <button onClick={() => setMes(mesSeguinte(mes))}>›</button>
      </div>

      {funcionarias.length === 0 ? (
        <div className="vazio">
          <span className="emoji">📅</span>
          Cadastre funcionárias para controlar a presença.
        </div>
      ) : (
        <div className="card">
          <div className="tabela-wrap">
            <table className="presenca">
              <thead>
                <tr>
                  <th className="nome-col">Funcionária</th>
                  {dias.map((d) => {
                    const fds = d.getDay() === 0 || d.getDay() === 6
                    return (
                      <th key={d.getDate()} className={fds ? 'fds' : ''}>
                        {d.getDate()}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {funcionarias.map((f) => (
                  <tr key={f.id}>
                    <td className="nome-col">
                      <span
                        className="avatar"
                        style={{
                          background: corAvatar(f.nome),
                          width: 26,
                          height: 26,
                          fontSize: 11,
                          display: 'inline-flex',
                          verticalAlign: 'middle',
                          marginRight: 8,
                        }}
                      >
                        {iniciais(f.nome)}
                      </span>
                      {f.nome}
                    </td>
                    {dias.map((d) => {
                      const key = chaveData(d)
                      const st = statusDe(f.id, key)
                      return (
                        <td key={key}>
                          <button
                            className="cel-dia"
                            title={st ? STATUS_DIA[st].label : 'Marcar'}
                            onClick={() => alternar(f.id, key)}
                          >
                            {st ? STATUS_DIA[st].emoji : ''}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="legenda">
            {Object.values(STATUS_DIA).map((s) => (
              <span key={s.label}>
                {s.emoji} {s.label}
              </span>
            ))}
            <span>⬜ Não marcado</span>
          </div>
        </div>
      )}
    </>
  )
}
