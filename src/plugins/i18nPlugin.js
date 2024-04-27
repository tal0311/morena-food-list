import {i18Service} from '@/services/i18n.service'






export default {
  install: (app, {lang}) => {
      // inject a globally available $translate() method
      app.config.globalProperties.$trans = (key) => {
        
       console.log(key);
      
        return i18Service.doTrans(key, lang)
      }
    }
  }