import Axios from 'axios'
import { useUserStore } from '@/stores/user-store'

// import { router } from '@/router'



const BASE_URL = import.meta.env.VITE_SERVER_URL + '/api/' 

var axios = Axios.create({
  withCredentials: true
})

export const httpService = {
  get(endpoint, data) {
    return ajax(endpoint, 'GET', data)
  },
  post(endpoint, data) {
    return ajax(endpoint, 'POST', data)
  },
  put(endpoint, data) {
    return ajax(endpoint, 'PUT', data)
  },
  delete(endpoint, data) {
    return ajax(endpoint, 'DELETE', data)
  }
}

async function ajax(endpoint, method = 'GET', data = null) {
  try {
    const res = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      data,
      params: method === 'GET' ? data : null
    })
    return res.data
  } catch (err) {
    console.info(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data:`, data)
    console.dir(err)
    // Error handling map for different HTTP status codes
    const errorHandlers = {
      401: () => {
        // Unauthorized - clear all storage and redirect to login
        sessionStorage.clear()
        localStorage.removeItem('loggedUser')
        
        try {
          const userStore = useUserStore()
          userStore.loggedUser = null
        } catch (e) {
          console.log('Could not clear user store:', e)
        }
        

        window.location.assign('/')
        
        return true // Indicates error was handled
      },
      
      403: () => {
        // Forbidden - log and don't retry
        console.error('Access forbidden:', err.response.data)
        return true
      },
      
      500: () => {
        // Server error - log and don't retry
        console.error('Server error:', err.response.data)
        return true
      },
      
      429: () => {
        // Rate limited - wait before retry
        console.warn('Rate limited, waiting before retry...')
        return true
      }
    }
    
    // Handle error if we have a handler for this status code
    if (err.response && errorHandlers[err.response.status]) {
      const wasHandled = errorHandlers[err.response.status]()
      if (wasHandled) return // Don't throw if error was handled
    }
    
    throw err
  }
}
