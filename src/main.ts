import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

library.add(faGithub)
library.add(faStarHalfStroke)
//ここまで追加

const app = createApp(App)
//コンポーネントの追加
app.component('fa', FontAwesomeIcon )

app.mount('#app')
