import React from 'react'
import { detectNetwork } from '../hooks/useCards'
import styles from './BinInfo.module.css'

const NET_COLORS = {
  VISA:       styles.visa,
  MASTERCARD: styles.mastercard,
  AMEX:       styles.amex,
  DISCOVER:   styles.discover,
  JCB:        styles.jcb,
  DINERS:     styles.diners,
  UNIONPAY:   styles.unionpay,
  MAESTRO:    styles.maestro,
  MIR:        styles.mir,
  RUPAY:      styles.rupay,
  UNKNOWN:    styles.unknown,
}

export default function BinInfo({ bin, info, loading }) {
  const network = (info?.ok && info.brand !== 'UNKNOWN') ? info.brand : (bin ? detectNetwork(bin) : 'UNKNOWN')
  const tagClass = NET_COLORS[network] || styles.unknown

  return (
    <div className={styles.panel}>
      <div className={styles.head}>BIN Info</div>
      <div className={styles.body}>
        <div className={styles.grid}>
          <div className={styles.row}>
            <span className={styles.key}>Network</span>
            <span className={styles.val}>
              {loading
                ? <span className={styles.spinner} />
                : <span className={`${styles.tag} ${tagClass}`}>{network}</span>
              }
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.key}>Bank</span>
            <span className={styles.val}>{loading ? 'Loading...' : (info?.ok ? info.bank : '—')}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.key}>Type</span>
            <span className={styles.val}>{loading ? 'Loading...' : (info?.ok && info.type ? info.type : '—')}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.key}>Country</span>
            <span className={styles.val}>
              {loading ? 'Loading...' : info?.ok
                ? [info.country, info.flag, info.currency].filter(Boolean).join(' ') || '—'
                : '—'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
