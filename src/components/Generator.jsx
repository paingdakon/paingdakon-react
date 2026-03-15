import React, { useState } from 'react'
import styles from './Generator.module.css'

const AMOUNTS = [1, 5, 10, 20, 50]
const MONTHS  = ['01','02','03','04','05','06','07','08','09','10','11','12']
const YEARS   = ['2026','2027','2028','2029','2030','2031','2032','2033','2034']

export default function Generator({ onGenerate, loading }) {
  const [bin,    setBin]    = useState('')
  const [month,  setMonth]  = useState('')
  const [year,   setYear]   = useState('')
  const [cvv,    setCvv]    = useState('')
  const [amount, setAmount] = useState(10)
  const [error,  setError]  = useState(false)

  function handleGenerate() {
    if (!bin.trim()) { setError(true); return }
    setError(false)
    onGenerate({ bin: bin.trim(), month, year, cvv, amount })
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleGenerate()
  }

  return (
    <div className={styles.panel}>
      <div className={styles.head}>Generator</div>
      <div className={styles.body}>

        <div>
          <label className={styles.label}>BIN / Pattern</label>
          <input
            className={styles.input}
            type="text"
            value={bin}
            onChange={e => { setBin(e.target.value); setError(false) }}
            onKeyDown={handleKey}
            placeholder="469308  ·  469308|12|27|123  ·  4693XXXX"
            autoComplete="off"
            spellCheck={false}
            inputMode="text"
          />
          {error && <div className={styles.err}>Enter a valid BIN (6+ digits)</div>}
        </div>

        <div className={styles.row3}>
          <div>
            <label className={styles.label}>Month</label>
            <select className={styles.select} value={month} onChange={e => setMonth(e.target.value)}>
              <option value="">Random</option>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.label}>Year</label>
            <select className={styles.select} value={year} onChange={e => setYear(e.target.value)}>
              <option value="">Random</option>
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.label}>CVV</label>
            <input
              className={styles.input}
              type="text"
              value={cvv}
              onChange={e => setCvv(e.target.value)}
              placeholder="Random"
              maxLength={4}
              autoComplete="off"
              inputMode="numeric"
            />
          </div>
        </div>

        <div>
          <label className={styles.label}>Amount</label>
          <div className={styles.amtRow}>
            {AMOUNTS.map(n => (
              <button
                key={n}
                className={`${styles.amtBtn} ${amount === n ? styles.active : ''}`}
                onClick={() => setAmount(n)}
              >{n}</button>
            ))}
          </div>
        </div>

        <div className={styles.genWrap}>
          <button
            className={styles.genBtn}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Cards'}
          </button>
        </div>

      </div>
    </div>
  )
}
