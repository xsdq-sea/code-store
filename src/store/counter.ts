import {defineStore} from 'pinia'
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    double: store => store.count * 2, // 箭头函数不可使用this
    triple(): number {
      // 普通函数可以直接使用this访问当前store
      return this.count * 3
    },
    quadruple(store): number {
      // 可以直接使用其他getters

      return store.double * 2 // 也可以使用this
    }
  },
  actions: {
    increment(n: number) {
      if (n !== 1) return Promise.reject('必须为1')
      this.count += n
    }
  }
})
