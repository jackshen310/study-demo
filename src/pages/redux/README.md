内容来源《《深入浅出React和Redux》
源码地址 https://github.com/mocheng/react-and-redux

Redux 中文文档 https://cn.redux.js.org/introduction/getting-started/
* 什么时候应该使用Redux https://cn.redux.js.org/tutorials/essentials/part-1-overview-concepts

* 安装Redux-Devtools https://github.com/reduxjs/redux-devtools/tree/main/extension#installation

# 概念
Action,可以将 action 视为描述应用程序中发生了什么的事件
* type 事件名称
* payload 事件body

一个典型的 action 对象可能如下所示：
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Buy milk'
}

Action Creator 是一个创建并返回一个 action 对象的函数。它的作用是让你不必每次都手动编写 action 对象
```js
const addTodo = text => {
  return {
    type: 'todos/todoAdded',
    payload: text
  }
}
```

Reducer (state, action) => newState
Reducer 必需符合以下规则：
* 仅使用 state 和 action 参数计算新的状态值
禁止直接修改 state。
* 必须通过复制现有的 state 并对复制的值进行更改的方式来做 不可变更新（immutable updates）。
* 禁止任何异步逻辑、依赖随机值或导致其他“副作用”的代码

```js
const initialState = { value: 0 }

function counterReducer(state = initialState, action) {
  // 检查 reducer 是否关心这个 action
  if (action.type === 'counter/increment') {
    // 如果是，复制 `state`
    return {
      ...state,
      // 使用新值更新 state 副本
      value: state.value + 1
    }
  }
  // 返回原来的 state 不变
  return state
}
```

Store 当前 Redux 应用的状态存在于一个名为 store 的对象中
store 是通过传入一个 reducer 来创建的，并且有一个名为 getState 的方法，它返回当前状态值
```js
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())
```

Dispatch
更新 state 的唯一方法是调用 store.dispatch() 并传入一个 action 对象,store 将执行所有 reducer 函数并计算出更新后的 state，调用 getState() 可以获取新 state。
```js
store.dispatch({ type: 'counter/increment' })

console.log(store.getState())
// {value: 1}
```

Selector Selector 函数可以从 store 状态树中提取指定的片段
```js
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
console.log(currentValue)
// 2
```

# Redux数据流
初始启动：
* 使用最顶层的 root reducer 函数创建 Redux store
* store 调用一次 root reducer，并将返回值保存为它的初始 state
* 当 UI 首次渲染时，UI 组件访问 Redux store 的当前 state，并使用该数据来决定要呈现的内容。同时监听 store 的更新，以便他们可以知道 state 是否已更改。

更新环节：
* 应用程序中发生了某些事情，例如用户单击按钮
* dispatch 一个 action 到 Redux store，例如 dispatch({type: 'counter/increment'})
* store 用之前的 state 和当前的 action 再次运行 reducer 函数，并将返回值保存为新的 state
* store 通知所有订阅过的 UI，通知它们 store 发生更新
* 每个订阅过 store 数据的 UI 组件都会检查它们需要的 state 部分是否被更新。
* 发现数据被更新的每个组件都强制使用新数据重新渲染，紧接着更新网页

![](https://cn.redux.js.org/assets/images/ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif)