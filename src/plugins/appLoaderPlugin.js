import { eventBus } from '@/services/event-bus.service'

export default {
  install(app) {
    // Add global methods to the app
    app.config.globalProperties.$showLoader = (message = '') => {
      eventBus.emit('showAppLoader', message)
    }
    
    app.config.globalProperties.$hideLoader = () => {
      eventBus.emit('hideAppLoader')
    }
    
    // Add to provide/inject for composition API
    app.provide('appLoader', {
      show: (message = '') => eventBus.emit('showAppLoader', message),
      hide: () => eventBus.emit('hideAppLoader')
    })
    
    // Add to window for global access
    window.$showLoader = (message = '') => eventBus.emit('showAppLoader', message)
    window.$hideLoader = () => eventBus.emit('hideAppLoader')
  }
}
