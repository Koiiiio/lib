import { createPinia } from 'pinia'
import persisit from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persisit)

export default pinia

export * from './modules/user'
export * from './modules/counter'
