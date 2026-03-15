import React, { useState } from 'react'
import styles from './CardList.module.css'

export default function CardList({ cards, timestamp, amount }) {
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)

  function copyOne(card, idx) {
    navigator.clipboard.writeText(card)
      .then(() => {
        setCopiedIdx(idx)
        setTimeout(() => setCopiedIdx(null), 1500)
      })
      .catch(() => alert('Copy failed'))
  }

  function copyAll() {
    navigator.clipboard.writeText(cards.join('\n'))
      .then(() => {
        setCopiedAll(true)
        setTimeout(() => setCopiedAll(false), 1500)
      })
      .catch(() => alert('Copy failed'))
  }

  return (
    <div className={styles.panel}>
      <div className={styles.bar}>
        <div className={styles.meta}>
          <span className={styles.label}>{amount} Cards Generated</span>
          {timestamp && <span className={styles.time}>{timestamp}</span>}
        </div>
        <button className={styles.copyAll} onClick={copyAll}>
          {copiedAll ? 'Copied!' : 'Copy All'}
        </button>
      </div>
      <div className={styles.list}>
        {cards.length === 0
          ? <div className={styles.empty}>Enter a BIN and press Generate</div>
          : cards.map((card, i) => (
            <div key={i} className={styles.row} style={{ animationDelay: `${i * 18}ms` }}>
              <span className={styles.num}>{card}</span>
              <button
                className={`${styles.cp} ${copiedIdx === i ? styles.ok : ''}`}
                onClick={() => copyOne(card, i)}
              >
                {copiedIdx === i ? 'copied' : 'copy'}
              </button>
            </div>
          ))
        }
      </div>
    </div>
  )
}
