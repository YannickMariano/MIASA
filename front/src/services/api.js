const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' }, ...options,
  })
  if (!response.ok) throw new Error('Le serveur ne répond pas')
  return response.json()
}

export const api = {
  dashboard: () => request('/dashboard'),
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
}
