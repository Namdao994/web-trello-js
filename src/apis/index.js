import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// new keyword Interceptors

export const fetchBoardDetailsAPI = async boardId => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

// boards
export const createNewColumnAPI = async newColumnData => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}
// cards

export const createNewCardAPI = async newCardData => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}
