import axios from 'axios'

export const BASE_URL = 'https://www.omdbapi.com/'

export const BaseService =  {
  get: async function(url: string) {
    try {
      const response = await axios.get(url)
      return response.data;
    } catch(error: unknown) {
      throw error;
    }
  }
}