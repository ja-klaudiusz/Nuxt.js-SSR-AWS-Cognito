export default function ({ store }) { 
  if(process.client) {
    store.dispatch('refreshToken') 
  }
}
