<template>
  <b-container>
    <b-row align-v="center">
      <b-col>
        <b-card bg-variant="light" label-cols-lg="12">
          <p v-if="error">{{error}}</p>
          <form @submit.prevent="loginUser"> 
            <b-form-group label-cols-lg="12" label="Sign in" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0">
              
              <b-form-group label-cols-sm="4" label="Email:" label-align-sm="right" label-for="nested-email">
                <b-form-input id="nested-email" type="text" value="demo"  v-model="email" required></b-form-input>
              </b-form-group>

              <b-form-group  label-cols-sm="4" label="Password:" label-align-sm="right" label-for="nested-password">
                <b-form-input id="nested-password" type="password" value="demo" v-model="password"></b-form-input>
              </b-form-group> 

              <b-button type="submit">Sign In</b-button> 
              <b-button to="/auth/register">Register</b-button> 
            </b-form-group>
          </form>  
        </b-card>
      </b-col>
    </b-row> 
  </b-container>
</template>

<script>
 
export default {
  middleware: ['refreshToken','notAuthenticated'],
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  }, 
  methods: {
    loginUser() {
      const { email, password } = this
      const data = { email, password }
    
      this.$axios('/auth/login', {
        method: 'post', 
        headers: {
          Accept: 'application/json',
          Content: 'application/json'
        },
        data: data
      }).then(res => { 
        const auth = res.data
        this.$store.commit('setAuth', auth)  
        this.$router.push('/')
      }).catch((err) => {
        this.error = err.response.data.error.message
        this.$store.commit('setAuth', null) 
        if(err.response.data.error.code == 'UserNotConfirmedException') {
          setTimeout(() => {
            this.$router.push('/auth/confirm/'+email)
          },3000)
        }
      })
    } 
  }
}
</script>