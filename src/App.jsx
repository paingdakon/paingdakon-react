import React, { useState, useEffect } from 'react'
import Header   from './components/Header'
import Generator from './components/Generator'
import BinInfo  from './components/BinInfo'
import CardList from './components/CardList'
import { parseInput, generateCard } from './hooks/useCards'
import { fetchBinInfo } from './hooks/useBinLookup'
import styles from './App.module.css'

export default function App() {
  const [theme,     setTheme]     = useState(() =>
    localStorage.getItem('pd-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )
  const [cards,     setCards]     = useState([])
  const [binInfo,   setBinInfo]   = useState(null)
  const [binLoading,setBinLoading]= useState(false)
  const [loading,   setLoading]   = useState(false)
  const [timestamp, setTimestamp] = useState('')
  const [lastBin,   setLastBin]   = useState('')
  const [lastAmt,   setLastAmt]   = useState(10)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pd-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  async function handleGenerate({ bin, month, year, cvv, amount }) {
    setLoading(true)
    setLastBin(bin)
    setLastAmt(amount)

    try {
      const parsed    = parseInput(bin)
      const generated = Array.from({ length: amount }, () =>
        generateCard(parsed, month, year, cvv)
      )
      setCards(generated)
      setTimestamp(new Date().toLocaleString())
      setBinLoading(true)
      setBinInfo(null)

      const info = await fetchBinInfo(bin)
      setBinInfo(info)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setBinLoading(false)
    }
  }

  return (
    <div className={styles.app}>
      <Header theme={theme} onToggle={toggleTheme} />
      <main className={styles.main}>
        <Generator onGenerate={handleGenerate} loading={loading} />
        <BinInfo bin={lastBin} info={binInfo} loading={binLoading} />
        <CardList cards={cards} timestamp={timestamp} amount={lastAmt} />
      </main>
      <footer className={styles.footer}>
        for testing &amp; development only — generated cards are not real
      </footer>
    </div>
  )
}
