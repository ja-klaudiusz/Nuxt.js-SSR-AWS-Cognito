<template>
  <b-container fluid>
    <b-jumbotron class="mt-3" header="404" lead="This page doesn’t exist">
      The link you clicked on may be broken or no longer exist.
      <hr class="my-4" />
      <b-button variant="primary" to="/">Home</b-button>
    </b-jumbotron>
  </b-container>
</template>
<script>
export default {
  name: 'error-404',
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
