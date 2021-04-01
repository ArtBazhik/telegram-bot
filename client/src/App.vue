<template>
  <div id="app" class="container">
    <h3>Создать пользователя</h3>
    <form class="card create-form" @submit.prevent="createHandler">
      <div class="card-content">
        <div class="input-field">
          <input type="text"
                 id="username"
                 placeholder="user name"
                 :class="{invalid: ($v.username.$dirty && !$v.username.required) || !$v.username.isChek}"
                 v-model.trim="username"
          >
          <label for="username">Имя пользоателя</label>
          <small class="helper-text invalid"
                 v-if="$v.username.$dirty && !$v.username.required"
          >Поле не должно быть пустым</small>
          <small class="helper-text invalid"
                 v-else-if="$v.username.$dirty && !$v.username.isChek">Только латинские символы</small>
        </div>
        <div class="input-field">
          <input type="text"
                 id="email"
                 v-model.trim="email"
                 placeholder="example@mail.ru"
                 :class="{
                   invalid: ($v.email.$dirty && !$v.email.required) ||
                   ($v.email.$dirty && !$v.email.email)
                 }"
          >
          <label for="email">Email</label>
          <small class="helper-text invalid"
                 v-if="$v.email.$dirty && !$v.email.required"
          >Поле не должно быть пустым</small>
          <small class="helper-text invalid"
                 v-else-if="$v.email.$dirty && !$v.email.email"
          >Введите коректный email</small>
        </div>
        <div class="input-field">
          <input type="tel"
                 id="telNumber"
                 v-facade="'+7 (###) ###-####'"
                 placeholder="929 999 9999"
                 v-model.trim="telNumber"
                 :class="{invalid: ($v.telNumber.$dirty && !$v.telNumber.required)}"
          >
          <label for="telNumber">Телефон</label>
          <small class="helper-text invalid" v-if="$v.telNumber.$dirty && !$v.telNumber.required">Поле не должно быть
            пустым</small>
        </div>
        <div class="input-field">
          <input type="date"
                 id="dateBorn"
                 v-model.trim="dateBorn"
                 :class="{invalid: ($v.dateBorn.$dirty && !$v.dateBorn.required)}">
          <label for="dateBorn">Дата рождения</label>
          <small class="helper-text invalid" v-if="$v.dateBorn.$dirty && !$v.dateBorn.required">Поле не должно быть
            пустым</small>
        </div>
        <button class="btn waves-effect" type="submit">Создать</button>
      </div>
    </form>
  </div>
</template>

<script>
import {email, required} from 'vuelidate/lib/validators'
import {InputFacade, facade, filter} from 'vue-input-facade'
import axios from 'axios'
// Подключение кастомного валидатора на проверку ввода латиницы (Username)
import {isChekForLatin} from './validate'

export default {
  name: 'App',
  data: () => ({
    username: '',
    email: '',
    telNumber: '',
    dateBorn: ''
  }),
  // Валидатор
  validations: {
    email: {email, required},
    username: {
      required,
      isChek: isChekForLatin
    },
    telNumber: {required},
    dateBorn: {required}
  },
  directives: {facade},
  filters: {facade: filter},
  components: {InputFacade},
  methods: {
    async createHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      const reversBornDate = this.dateBorn.split('-').reverse().join('-')
      const user = {
        username: this.username,
        email: this.email,
        dateBorn: reversBornDate,
        telNumber: this.telNumber
      }
      this.$v.$reset()
      await axios.post('http://localhost:3000/api/users', user)
      window.M.toast({html: `Пользователь ${user.username} создан`})

      this.username = ''
      this.email = ''
      this.telNumber = ''
      this.dateBorn = ''
    },

  },
}
</script>

<style lang="scss">
h3 {
  margin-bottom: 50px;
}

.invalid {
  color: red !important;
}

.create-form {
  width: 600px;
  margin: 0 auto;
}
</style>
