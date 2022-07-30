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

#FAQ
现在你可能想知道，“我是否总是需要将我所有应用程序的状态放入 Redux store？”
答案是 不。整个应用程序所需的全局状态应该放在 Redux store 中。而只在一个地方用到的状态应该放到组件的 state。
在 React + Redux 应用中，你的全局状态应该放在 Redux store 中，你的本地状态应该保留在 React 组件中。(一个状态，如果在另一个组件/模块使用，那么它应该放在Redux).

如果您不确定该放在哪里，这里有一些常用的经验法则，用于确定应该将哪种数据放入 Redux：
* 应用程序的其他部分是否关心这些数据？
* 您是否需要能够基于这些原始数据创建进一步的派生数据？
* 是否使用相同的数据来驱动多个组件？
* 能够将这种状态恢复到给定的时间点（即时间旅行调试）对您是否有价值？
* 是否要缓存数据（即，如果数据已经存在，则使用它的状态而不是重新请求它）？
* 您是否希望在热重载 UI 组件（交换时可能会丢失其内部状态）时保持此数据一致？

表单数据是否放入Redux Store？
这也是一般如何在 Redux 中考虑表单的一个很好的例子。 大多数表单的 state 不应该保存在 Redux 中。 相反，在编辑表单的时候把数据存到表单组件中，当用户提交表单的时候再 dispatch action 来更新 store。

# redux-thunk
![](https://cn.redux.js.org/assets/images/ReduxAsyncDataFlowDiagram-d97ff38a0f4da0f327163170ccc13e80.gif)

* 可以编写可复用的“selector 选择器”函数来封装从 Redux 状态中读取数据的逻辑
  * 选择器是一种函数，它接收 Redux state 作为参数，并返回一些数据
* Redux 使用叫做“中间件”这样的插件模式来开发异步逻辑
  * 官方的处理异步中间件叫 redux-thunk，包含在 Redux Toolkit 中
  * Thunk 函数接收 dispatch 和getState 作为参数，并且可以在异步逻辑中使用它们
* 您可以 dispatch 其他 action 来帮助跟踪 API 调用的加载状态
  * 典型的模式是在调用之前 dispatch 一个 "pending" 的 action，然后是包含数据的 “sucdess” 或包含错误的 “failure” action
  * 加载状态通常应该使用枚举类型，如 'idle' | 'loading' | 'succeeded' | 'failed'
* Redux Toolkit 有一个 createAsyncThunk API 可以为你 dispatch 这些 action
  * createAsyncThunk 接受一个 “payload creator” 回调函数，它应该返回一个 Promise，并自动生成 pending/fulfilled/rejected action 类型
  * 像 fetchPosts 这样生成的 action creator 根据你返回的 Promise dispatch 这些 action
  * 可以使用 extraReducers 字段在 createSlice 中监听这些 action，并根据这些 action 更新 reducer 中的状态。
  * action creator 可用于自动填充 extraReducers 对象的键，以便切片知道要监听的 action。
  * Thunk 可以返回 promise。 具体对于createAsyncThunk，你可以await dispatch(someThunk()).unwrap()来处理组件级别的请求成功或失败。