import { useState, useEffect } from 'react'

// Persiste o estado no localStorage do navegador, para os dados
// não se perderem ao recarregar a página.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignora erros de quota / modo privado
    }
  }, [key, value])

  return [value, setValue]
}
