<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">Nuxt.js SSR & AWS Cognito</h1>
      <h2 class="subtitle">Cookie<small> (HttpOnly)</small> base authentication boilerplate</h2>
      <div class="links" v-if="$store.state.auth">
        <p>
          You are authenticated. You can see the
          <NuxtLink to="/secret" class="button--green">
            secret page
          </NuxtLink>
        </p>  
      </div>
      <div class="links" v-else>
        <p>
          You are not authenticated. 
          <NuxtLink to="/auth/login" class="button--green">Login</NuxtLink>
          <NuxtLink to="/auth/register" class="button--green">Register</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
import Logo from '~/components/Logo.vue'

export default { 
  middleware: 'refreshToken',
  data() {
    return {}
  },
  components: {
    Logo
  },
  methods: {
    logout () {
      this.$axios('/auth/logout', {
        method: 'post', 
        headers: {
          Accept: 'application/json',
          Content: 'application/json'
        }
      }).then(res => {
        this.$store.commit('setAuth', null)
        this.$router.push('/')
      }).catch(err => { 
        console.log(err)
        this.$store.commit('setAuth', null)
        this.$router.push('/')
      })
    },
    refreshToken() {
      this.$axios('/auth/refresh-token', {
        method: 'post', 
        headers: {
          Accept: 'application/json',
          Content: 'application/json'
        }
      }).then(result => { 
          try { 
            this.$store.commit('setAuth', result.data)
            this.$router.push('/')
          } catch(e) {
            console.log(e);
            commit('setAuth',null)
          }
        }).catch((e)=>{
          console.log(e.message);
          commit('setAuth',null)
        });
    }
  }
}
</script>

<style>
h1 {
font-size: 60px !important;
}
small, .small {
    font-size: 70%;
    font-weight: 200;
}
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
