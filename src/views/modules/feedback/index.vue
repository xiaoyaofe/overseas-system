<template>
    <div class="container">
        <!-- 动态组件 -->
        <component v-bind:is="componentName"></component>
    </div>
</template>
<script>
import deliverySystem from './deliverySystem/index.vue'
import h5DeliverySystem from './h5DeliverySystem/index.vue'
import overseasDistributionSystem from './overseasDistributionSystem/index.vue'
export default {
    components: {
        deliverySystem,
        h5DeliverySystem,
        overseasDistributionSystem,
    },
    data() {
        return {
            componentName:'deliverySystem',
        }
    },
    created () {
        let systemId =this.$store.state.common.systems.systemId;
        switch (systemId) {
            case 2://海外发行系统
                this.componentName = "overseasDistributionSystem"
                break;
            case 4://投放系统
                this.componentName = "deliverySystem"
                break;
            case 5://H5投放系统
                this.componentName = "h5DeliverySystem"
                break;
            default:
                break;
        }
        
    }
}
</script>
<style lang="scss" scoped>
.container{
    width: 95%;
    margin: 12px;
    padding: 15px;
    // background: rgba(208, 196, 214, 0.5);
   
}    
</style>