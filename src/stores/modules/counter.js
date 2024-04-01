import { defineStore } from 'pinia'
import { ref } from 'vue'
//数字计数器
export const useCounterStore = defineStore('big-count', () => {
  const count = ref(100)
  const add = (n) => {
    count.value += n
  }
  return {
    count,
    add
  }
})
