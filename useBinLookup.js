const CACHE = (() => {
  try { return JSON.parse(localStorage.getItem('pd-bin-cache') || '{}') }
  catch { return {} }
})()

function saveCache() {
  try { localStorage.setItem('pd-bin-cache', JSON.stringify(CACHE)) }
  catch {}
}

function parseBinResponse(d, source) {
  if (source === 'bl') return {
    ok:       true,
    bank:     (d.bank?.name    || 'UNKNOWN').toUpperCase(),
    brand:    (d.scheme        || 'UNKNOWN').toUpperCase(),
    type:     `${d.type || ''} ${d.brand || ''}`.toUpperCase().trim(),
    country:  (d.country?.name || 'UNKNOWN').toUpperCase(),
    flag:     d.country?.emoji || '',
    currency: d.country?.currency || '',
  }
  if (source === 'ha') return {
    ok:       true,
    bank:     (d.Issuer        || 'UNKNOWN').toUpperCase(),
    brand:    (d.Scheme        || 'UNKNOWN').toUpperCase(),
    type:     `${d.Type || ''} ${d.Scheme || ''}`.toUpperCase().trim(),
    country:  (d.Country?.Name || d.CountryName || 'UNKNOWN').toUpperCase(),
    flag:     '',
    currency: '',
  }
  return {
    ok:       true,
    bank:     (d.bank    || d.Issuer      || 'UNKNOWN').toUpperCase(),
    brand:    (d.scheme  || d.Scheme      || 'UNKNOWN').toUpperCase(),
    type:     (d.type    || d.Type        || '').toUpperCase(),
    country:  (d.country || d.CountryName || 'UNKNOWN').toUpperCase(),
    flag:     '',
    currency: d.currency || '',
  }
}

export async function fetchBinInfo(binVal) {
  const clean = binVal.replace(/x/gi, '0').replace(/\D/g, '').slice(0, 6)
  if (CACHE[clean]) return CACHE[clean]

  const apis = [
    [`https://data.handyapi.com/bin/${clean}`,      'ha'],
    [`https://lookup.binlist.net/${clean}`,         'bl'],
    [`https://api.freebinchecker.com/bin/${clean}`, 'g'],
  ]

  for (const [url, src] of apis) {
    try {
      const ctrl = new AbortController()
      const tid  = setTimeout(() => ctrl.abort(), 8000)
      const r    = await fetch(url, { signal: ctrl.signal })
      clearTimeout(tid)
      if (!r.ok) continue
      const res = parseBinResponse(await r.json(), src)
      if (res.brand !== 'UNKNOWN' || res.bank !== 'UNKNOWN') {
        CACHE[clean] = res
        saveCache()
        return res
      }
    } catch { continue }
  }
  return { ok: false }
}
