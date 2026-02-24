<template>
  <div>
    <fieldset>
      <legend>counter</legend>
      <p>计数器：{{ counter.count }}</p>
      <p>双倍：{{ counter.double }}</p>
      <p>三倍：{{ counter.triple }}</p>
      <p>四倍：{{ counter.quadruple }}</p>
      <el-button type="primary" @click="increment">+1</el-button>
    </fieldset>
    <fieldset>
      <legend>user</legend>
      <p>姓名：{{ name }}</p>
      <p>爱好：{{ hobbyList.join(',') }}</p>
      <el-button type="primary" @click="modifyName">修改姓名</el-button>
      <el-button type="primary" @click="addHobby">新增爱好</el-button>
      <el-button type="primary" @click="replaceAll">替换整个状态</el-button>
    </fieldset>
    <br />
    <el-button type="primary" @click="reset">重置</el-button>
  </div>
</template>
<script setup lang="ts">
import {useCounterStore} from '@/store/counter'
import {useUserStore} from '@/store/user'
import {storeToRefs} from 'pinia'

const counter = useCounterStore()
const increment = () => {
  counter.increment(1) // 使用action
}
// 监听action调用
counter.$onAction(({after, store, name, args, onError}) => {
  console.log('调用的action为' + name + '\n参数为', args)
  console.log('修改前：count = ', store.count)
  after(() => {
    console.log('修改后：count = ', store.count)
  })
  onError(r => {
    console.log(r)
  })
})

const user = useUserStore()
// const {name, hobbyList} = user // 解构后会失去响应性
const {name, hobbyList} = storeToRefs(user) // 该方式不会失去响应性
const modifyName = () => {
  // user.name = '李四' // 直接修改 mutation.type === 'direct'
  // user.modify() // 使用action mutation.type === 'direct'
  // user.$patch({name: '李四'}) //  mutation.type === 'patch object'
  user.$patch(state => (state.name = '李四')) // mutation.type === 'patch function'
}
const addHobby = () => {
  // hobbyList.value.push('打王者')
  // user.hobbyList.push('打王者')
  user.$patch(state => state.hobbyList.push('打王者'))
}
// 将整个state替换为新的对象
const replaceAll = () => {
  user.$state = {name: '王五', hobbyList: ['睡觉']}
}
// 监听state改变
user.$subscribe((mutation, state) => {
  console.log(mutation)
  console.log(state)
})

// 将state重置为初始值
const reset = () => {
  counter.$reset()
  // user.$reset() // 报错，user 是通过函数的方式创建的，没有$reset方法
}
</script>

<style lang="less" scoped></style>
