<template>
  <b-container>
    <b-row align-v="center">
      <b-col>
        <b-card bg-variant="light" label-cols-lg="12">
          <p v-if="error">{{error}}</p>
          <form @submit.prevent="confirm"> 
            <b-form-group label-cols-lg="12" label="Confirm" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0">
              {{email}}
              <b-form-group label-cols-sm="4" label="Code:" label-align-sm="right" label-for="nested-code">
                <b-form-input id="nested-email" type="text" value=""  v-model="code" required></b-form-input>
              </b-form-group> 

              <b-button type="submit">Confirm</b-button>  
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
  validate ({ params }) { 
    if(!params.email) return false 
    return true
  },
  data() {
    return {
      code: '',
      error: '',
      email: ''
    }
  }, 
  asyncData(context) {
    return  {
      email: context.params.email
    }
  },
  methods: {
    confirm() {
      const { code, email } = this
      const data = { code, email }
    
      this.$axios('/auth/confirm', {
        method: 'post', 
        headers: {
          Accept: 'application/json',
          Content: 'application/json'
        },
        data: data
      }).then(res => { 
        const auth = res.data 
        this.$router.push('/auth/login')
      }).catch((err) => {
        this.error = err.response.data.error 
      })
    } 
  }
}
</script>