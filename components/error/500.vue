<template>
   <b-container fluid> 
    <b-jumbotron class="mt-3" lead="Ups, somethings went wrong">
      Go to the home page and try again
      <hr class="my-4">   
      <b-button variant="primary" to="/">Home</b-button>
    </b-jumbotron> 
 </b-container>
</template>
<script>
export default {
  name: 'error-500',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
};
</script> 