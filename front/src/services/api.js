const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' }, ...options,
  })
  if (!response.ok) throw new Error('Le serveur ne répond pas')
  return response.json()
}

// POST JSON qui remonte le message d'erreur du serveur (ex. ESP32 injoignable).
async function send(path, data) {
  const response = await fetch(`${API_URL}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.message || 'Le serveur ne répond pas')
  return body
}

export const api = {
  dashboard: () => request('/dashboard'),
  sensorHistory: (limit = 100) => request(`/sensors/history?limit=${limit}`),
  toggleIrrigation: (enabled) => request('/irrigation/toggle', { method: 'POST', body: JSON.stringify({ enabled }) }),
  updateSettings: (data) => request('/irrigation/settings', { method: 'PUT', body: JSON.stringify(data) }),
  analyzePlant: async (image) => {
    const body = new FormData(); body.append('image', image, image.name || 'capture.jpg')
    const response = await fetch(`${API_URL}/diagnosis/analyze`, { method: 'POST', body })
    if (!response.ok) throw new Error((await response.json()).message || 'Analyse impossible')
    return response.json()
  },
  weatherInsights: (place, crop) => request(`/insights/weather?place=${encodeURIComponent(place)}&crop=${encodeURIComponent(crop)}`),
  marketInsights: () => request('/insights/market'),
  setIrrigationMode: (mode) => send('/irrigation/mode', { mode }),
  manualPump: (on) => send('/irrigation/pump', { on }),
  listings: () => request('/listings'),
  listingOptions: () => request('/listings/options'),
  publishListing: async (data) => {
    const response = await fetch(`${API_URL}/listings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body.message || 'Publication impossible')
    return body
  },
  removeListing: async (id, token) => {
    const response = await fetch(`${API_URL}/listings/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'X-Delete-Token': token } })
    if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || 'Suppression impossible')
  },
}
