<template>
 <b-container fluid> 
  <b-jumbotron class="mt-3" v-if="$store.state.auth" header="Secret JWT Token" :lead="$store.state.auth.jwt">
     <strong>Valid to:</strong> {{ new Date($store.state.auth.jwt_expired) }}
    <hr class="my-4"> 
    <b-button @click="refreshToken" v-if="$store.state.auth">Refresh token</b-button> 
    <b-button variant="primary" to="/">Home</b-button>
  </b-jumbotron> 
 </b-container>
</template>

<script>
export default {
  middleware: ['refreshToken','authenticated'],
    methods: { 
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
.lead {
    -ms-word-break: break-all;
    word-break: break-all;
    word-break: break-word;
}
</style>