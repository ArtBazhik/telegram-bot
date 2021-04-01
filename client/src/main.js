import Vue from 'vue'
import Vuelidate from 'vuelidate'
import InputFacade from 'vue-input-facade'
import App from './App.vue'


Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(InputFacade)
new Vue({
    render: h => h(App),
}).$mount('#app')
