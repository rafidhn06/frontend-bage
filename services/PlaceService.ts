import apiClient from './apiClient'

type PlacePayload = {
  name: string
  lat?: number
  lng?: number
  address?: string
  [k: string]: any
}

const PlaceService = {
  async list() {
    const res = await apiClient.get('/locations')
    return res.data
  },

  async get(id: number) {
    const res = await apiClient.get(`/locations/${id}`)
    return res.data
  },

  async create(payload: PlacePayload) {
    const res = await apiClient.post('/locations', payload)
    return res.data
  },

  async remove(id: number) {
    const res = await apiClient.delete(`/locations/${id}`)
    return res.data
  },
}

export default PlaceService
