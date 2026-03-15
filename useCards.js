export function luhnComplete(digits) {
  const payload = [...digits].reverse()
  for (let i = 0; i < payload.length; i += 2) {
    payload[i] *= 2
    if (payload[i] > 9) payload[i] -= 9
  }
  const checksum = (10 - (payload.reduce((a, b) => a + b, 0) % 10)) % 10
  return [...digits, checksum]
}

export function isAmex(bin) {
  return /^3[47]/.test(bin.replace(/x/gi, '0'))
}

export function detectNetwork(bin) {
  const b = bin.replace(/x/gi, '0')
  if (/^4/.test(b))                return 'VISA'
  if (/^5[1-5]/.test(b))          return 'MASTERCARD'
  if (/^2[2-7]/.test(b))          return 'MASTERCARD'
  if (/^3[47]/.test(b))           return 'AMEX'
  if (/^6011/.test(b))            return 'DISCOVER'
  if (/^64[4-9]/.test(b))         return 'DISCOVER'
  if (/^65/.test(b))              return 'DISCOVER'
  if (/^62/.test(b))              return 'UNIONPAY'
  if (/^6[37]/.test(b))           return 'MAESTRO'
  if (/^35(2[89]|[3-8])/.test(b)) return 'JCB'
  if (/^3[068]/.test(b))          return 'DINERS'
  if (/^220[0-4]/.test(b))        return 'MIR'
  if (/^60(80|69)/.test(b))       return 'RUPAY'
  return 'UNKNOWN'
}

export function parseInput(raw) {
  const text = raw.toLowerCase().trim()
  const parts = text.split(/[|/]/)
  let bin = null, month = null, year = null, cvv = null

  const bm = (parts[0] || '').match(/[0-9x]{6,16}/i)
  if (bm) bin = bm[0]
  if (parts[1]) { const v = parseInt(parts[1]); if (v >= 1 && v <= 12) month = String(v).padStart(2, '0') }
  if (parts[2]) { const y = parts[2].trim(); if (/^\d{2,4}$/.test(y)) year = y.length === 4 ? y : `20${y}` }
  if (parts[3]) { const c = parts[3].trim(); if (/^\d{3,4}$/.test(c)) cvv = c }

  return { bin, month, year, cvv }
}

export function generateCard(parsed, uiMonth, uiYear, uiCvv) {
  const rawBin = parsed.bin || '469308'
  const amex   = isAmex(rawBin)
  const fillTo = amex ? 14 : 15

  const digits = []
  for (const ch of rawBin.toLowerCase()) {
    if (ch === 'x') digits.push(Math.floor(Math.random() * 10))
    else if (/\d/.test(ch)) digits.push(parseInt(ch))
  }
  while (digits.length < fillTo) digits.push(Math.floor(Math.random() * 10))
  const cardNo = luhnComplete(digits.slice(0, fillTo)).join('')

  const month = uiMonth || parsed.month || String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
  const cur   = new Date().getFullYear()
  const year  = uiYear  || parsed.year  || String(cur + Math.floor(Math.random() * 9))
  const cvv   = uiCvv   || parsed.cvv   || (amex
    ? String(Math.floor(Math.random() * 9000) + 1000)
    : String(Math.floor(Math.random() * 900) + 100))

  return `${cardNo}|${month}|${year}|${cvv}`
}
