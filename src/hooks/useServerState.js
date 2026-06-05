import { useState, useEffect, useRef } from 'react'

// Mantém um pedaço do estado sincronizado com o servidor local (SQLite).
// - Ao montar, carrega o valor salvo no servidor.
// - A cada mudança, grava de volta (com um pequeno atraso para não
//   disparar a cada tecla digitada).
//
// Como todos os aparelhos no Wi-Fi falam com o mesmo servidor, os dados
// são compartilhados. Para ver alterações feitas em OUTRO aparelho,
// basta recarregar a página.
export function useServerState(key, initialValue) {
  const [value, setValue] = useState(initialValue)
  const [carregado, setCarregado] = useState(false)
  const timer = useRef(null)

  // Carrega do servidor uma vez.
  useEffect(() => {
    let ativo = true
    fetch(`/api/state/${key}`)
      .then((r) => r.json())
      .then((d) => {
        if (!ativo) return
        if (d.value !== null && d.value !== undefined) setValue(d.value)
        setCarregado(true)
      })
      .catch(() => setCarregado(true))
    return () => {
      ativo = false
    }
  }, [key])

  // Grava no servidor quando o valor muda (após o carregamento inicial).
  useEffect(() => {
    if (!carregado) return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      fetch(`/api/state/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      }).catch(() => {})
    }, 300)
    return () => clearTimeout(timer.current)
  }, [key, value, carregado])

  return [value, setValue]
}
