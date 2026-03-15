import React from 'react'
import styles from './Header.module.css'

export default function Header({ theme, onToggle }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.icon}>PD</div>
        <span className={styles.name}>paingdakon</span>
      </div>
      <div className={styles.right}>
        <div className={styles.badge}>
          <span className={styles.dot} />
          online
        </div>
        <button className={styles.themeBtn} onClick={onToggle} title="Toggle theme">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  )
}
