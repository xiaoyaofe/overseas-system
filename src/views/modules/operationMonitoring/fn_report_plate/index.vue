<template>
  <div>
      <!-- <keep-alive> -->
        <component v-bind:is="currentTabComponent" @changComponents='changComponents'></component>
      <!-- </keep-alive> -->
    
  </div>
</template>
<script>
import mainPage from './component/main_page'
import queryPage from './component/query_page'
export default {
  components:{
    mainPage,queryPage
  },
  data() {
    return {
      currentTabComponent:'mainPage'
    }
  },
  methods:{
    changComponents(data){
      this.currentTabComponent = data.name;
      console.log(data);
      
    }
  }
  
}
</script>
<style lang="scss" scoped>

</style>
