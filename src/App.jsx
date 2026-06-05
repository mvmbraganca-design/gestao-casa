import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { FUNCIONARIAS_EXEMPLO } from './utils.js'
import Funcionarias from './components/Funcionarias.jsx'
import Presenca from './components/Presenca.jsx'
import Pagamentos from './components/Pagamentos.jsx'
import Tarefas from './components/Tarefas.jsx'

const ABAS = [
  { id: 'funcionarias', label: 'Funcionárias', emoji: '👥' },
  { id: 'presenca', label: 'Presença', emoji: '📅' },
  { id: 'pagamentos', label: 'Pagamentos', emoji: '💰' },
  { id: 'tarefas', label: 'Tarefas', emoji: '📝' },
]

export default function App() {
  const [aba, setAba] = useState('funcionarias')

  // Estados persistidos no navegador.
  const [funcionarias, setFuncionarias] = useLocalStorage('gc:funcionarias', FUNCIONARIAS_EXEMPLO)
  const [presenca, setPresenca] = useLocalStorage('gc:presenca', {})
  const [pagamentos, setPagamentos] = useLocalStorage('gc:pagamentos', {})
  const [tarefas, setTarefas] = useLocalStorage('gc:tarefas', [])

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">🏠 Gestão da Casa</div>
        {ABAS.map((a) => (
          <button
            key={a.id}
            className={`nav-item ${aba === a.id ? 'active' : ''}`}
            onClick={() => setAba(a.id)}
          >
            <span>{a.emoji}</span>
            {a.label}
          </button>
        ))}
        <div className="rodape">Feito com ❤️ usando Claude</div>
      </aside>

      <main className="main">
        {aba === 'funcionarias' && (
          <Funcionarias funcionarias={funcionarias} setFuncionarias={setFuncionarias} />
        )}
        {aba === 'presenca' && (
          <Presenca funcionarias={funcionarias} presenca={presenca} setPresenca={setPresenca} />
        )}
        {aba === 'pagamentos' && (
          <Pagamentos
            funcionarias={funcionarias}
            presenca={presenca}
            pagamentos={pagamentos}
            setPagamentos={setPagamentos}
          />
        )}
        {aba === 'tarefas' && (
          <Tarefas funcionarias={funcionarias} tarefas={tarefas} setTarefas={setTarefas} />
        )}
      </main>
    </div>
  )
}
