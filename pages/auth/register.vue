<template>
  <b-container>
    <b-row align-v="center">
      <b-col>
        <b-card bg-variant="light" label-cols-lg="12">
          <p v-if="error">{{error}}</p>
          <form @submit.prevent="registerUser"> 
            <b-form-group label-cols-lg="12" label="Sign up" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0">
              
              <b-form-group label-cols-sm="4" label="Email:" label-align-sm="right" label-for="nested-email">
                <b-form-input id="nested-email" type="text" value="" v-model="email" required></b-form-input>
              </b-form-group>

              <b-form-group label-cols-sm="4" label="Phone:" label-align-sm="right" label-for="nested-phone">
                <b-form-input id="nested-phone" type="text" value="" v-model="phone" required></b-form-input>
              </b-form-group>

              <b-form-group  label-cols-sm="4" label="Password:" label-align-sm="right" label-for="nested-password">
                <b-form-input id="nested-password" type="password" value="demo" v-model="password"></b-form-input>
              </b-form-group> 

              <b-button type="submit">Sign Up</b-button> 
              <b-button to="/auth/login">Login</b-button> 
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
      phone: '',
      error: ''
    }
  }, 
  methods: {
    registerUser() {
      const { email, password, phone } = this
      const data = { email, password, phone }
    
      this.$axios('/auth/register', {
        method: 'post', 
        headers: {
          Accept: 'application/json',
          Content: 'application/json'
        },
        data: data
      }).then(res => { 
        const auth = res.data
        this.$router.push('/auth/confirm/'+email)
      }).catch((err) => { 
        this.error = err.response.data.error.message
        if(err.response.data.error.code == 'UsernameExistsException') {
          setTimeout(() => {
            this.$router.push('/auth/login')
          },3000)
        }
      })
    } 
  }
}
</script>