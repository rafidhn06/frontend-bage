import apiClient from './apiClient'

type PostPayload = {
  title?: string
  body?: string
  location_id?: number
  [k: string]: any
}

const PostService = {
  async feed(type: 'fyp' | 'following' = 'fyp', page = 1) {
    const res = await apiClient.get('/feed', { params: { type: type === 'fyp' ? 'fyp' : 'following', page } })
    return res.data
  },
  async get(id: number) {
    const res = await apiClient.get(`/posts/${id}`)
    return res.data
  },

  async create(payload: PostPayload) {
    const res = await apiClient.post('/posts', payload)
    return res.data
  },

  async remove(id: number) {
    const res = await apiClient.delete(`/posts/${id}`)
    return res.data
  },

  async toggleLike(id: number) {
    const res = await apiClient.post(`/posts/${id}/like`)
    return res.data
  },

  async getComments(postId: number) {
    const res = await apiClient.get(`/posts/${postId}/comments`)
    return res.data
  },

  async addComment(postId: number, payload: { body: string }) {
    const res = await apiClient.post(`/posts/${postId}/comments`, payload)
    return res.data
  },
}

export default PostService
