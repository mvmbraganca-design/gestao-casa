import { useState } from 'react'
import {
  formatMoeda,
  mesAtual,
  nomeMes,
  mesAnterior,
  mesSeguinte,
  iniciais,
  corAvatar,
} from '../utils.js'

export default function Pagamentos({ funcionarias, presenca, pagamentos, setPagamentos }) {
  const [mes, setMes] = useState(mesAtual())

  // Conta quantos dias a funcionária trabalhou no mês selecionado.
  function diasTrabalhados(funcId) {
    const dados = presenca?.[funcId] || {}
    return Object.entries(dados).filter(([data, st]) => data.startsWith(mes) && st === 'trabalhou').length
  }

  // Valor devido no mês conforme o tipo de pagamento.
  function valorDevido(f) {
    if (f.tipo === 'mensal') return f.valor
    return diasTrabalhados(f.id) * f.valor
  }

  function estaPago(funcId) {
    return !!pagamentos?.[mes]?.[funcId]
  }

  function alternarPago(funcId) {
    setPagamentos((prev) => {
      const doMes = { ...(prev[mes] || {}) }
      if (doMes[funcId]) delete doMes[funcId]
      else doMes[funcId] = true
      return { ...prev, [mes]: doMes }
    })
  }

  const totalMes = funcionarias.reduce((s, f) => s + valorDevido(f), 0)
  const totalPago = funcionarias.filter((f) => estaPago(f.id)).reduce((s, f) => s + valorDevido(f), 0)
  const totalPendente = totalMes - totalPago

  return (
    <>
      <div className="header">
        <div>
          <h1>Pagamentos</h1>
          <p>Valores calculados a partir da presença e dos valores cadastrados.</p>
        </div>
      </div>

      <div className="mes-nav">
        <button onClick={() => setMes(mesAnterior(mes))}>‹</button>
        <div className="mes-nome">{nomeMes(mes)}</div>
        <button onClick={() => setMes(mesSeguinte(mes))}>›</button>
      </div>

      {funcionarias.length === 0 ? (
        <div className="vazio">
          <span className="emoji">💰</span>
          Cadastre funcionárias para calcular pagamentos.
        </div>
      ) : (
        <>
          <div className="stats">
            <div className="stat">
              <div className="rotulo">Total do mês</div>
              <div className="valor">{formatMoeda(totalMes)}</div>
            </div>
            <div className="stat">
              <div className="rotulo">Já pago</div>
              <div className="valor" style={{ color: '#16a34a' }}>
                {formatMoeda(totalPago)}
              </div>
            </div>
            <div className="stat">
              <div className="rotulo">Pendente</div>
              <div className="valor" style={{ color: '#a16207' }}>
                {formatMoeda(totalPendente)}
              </div>
            </div>
          </div>

          <div className="card">
            {funcionarias.map((f) => {
              const pago = estaPago(f.id)
              return (
                <div key={f.id} className="pag-linha">
                  <div className="avatar" style={{ background: corAvatar(f.nome) }}>
                    {iniciais(f.nome)}
                  </div>
                  <div className="pag-info">
                    <div className="nome" style={{ fontWeight: 600 }}>
                      {f.nome}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                      {f.tipo === 'mensal'
                        ? 'Mensalista'
                        : `${diasTrabalhados(f.id)} dia(s) × ${formatMoeda(f.valor)}`}
                    </div>
                  </div>
                  <div className="pag-valor">{formatMoeda(valorDevido(f))}</div>
                  <div style={{ minWidth: 90, textAlign: 'center' }}>
                    {pago ? (
                      <span className="badge-pago">✓ Pago</span>
                    ) : (
                      <span className="badge-pendente">Pendente</span>
                    )}
                  </div>
                  <button
                    className={`btn btn-sm ${pago ? 'btn-ghost' : 'btn-primary'}`}
                    onClick={() => alternarPago(f.id)}
                  >
                    {pago ? 'Desfazer' : 'Marcar pago'}
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}
