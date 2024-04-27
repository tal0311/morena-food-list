import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18nPlugin from './plugins/i18nPlugin'
import svgPlugin from './plugins/svgPlugin'

const app = createApp(App)



app.use(router)
app.use(createPinia())

import { useListStore } from '@/stores/list-store'
const listStore = useListStore()

app.use(i18nPlugin,{
    lang:listStore.getCurrLang
})

app.use(svgPlugin)

app.mount('#app')
