import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import {useCounterStore} from './counter'
export const useUserStore = defineStore('user', () => {
  const name = ref('张三')
  const hobbyList = ref(['玩手机'])
  function modify() {
    name.value = '李四'
  }
  const counter = useCounterStore()
  const nameCount = computed(() => name.value + counter.count)
  return {name, modify, hobbyList, nameCount}
})
