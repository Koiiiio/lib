<script setup>
/*
import { useRoute,useRouter } from 'vue-router';
import { useUserStore,useCounterStore } from '@/stores';



  const router=useRouter()
  const route=useRoute()

  const goList=()=>{
    
    router.push('/list')
    console.log(router,route)
  }

  const userStore=useUserStore()
  const countStore=useCounterStore()
*/
import en from 'element-plus/dist/locale/en.mjs'
</script>

<template>
  <div>
    <el-config-provider :locale="en">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style scoped></style>
