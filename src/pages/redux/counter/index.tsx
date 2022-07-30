import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import store from "../store";
import { logAndAdd } from "./slice";
import { decremented, incremented, selectCount } from "./slice";

const Counter = () => {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  /**
   *“我是否总是需要将我所有应用程序的状态放入 Redux store？”
   * 答案是 不。整个应用程序所需的全局状态应该放在 Redux store 中。
   * 而只在一个地方用到的状态应该放到组件的 state。
   */
  const [value, setValue] = useState(0);

  const handleAdd = () => {
    dispatch(incremented());
  };
  const handleDel = () => {
    dispatch(decremented());
  };

  const handleAmount = () => {
    // 暂时不用用dispatch hooks 后面再看
    store.dispatch(logAndAdd(value));
  };

  return (
    <div style={{ marginLeft: 100 }}>
      <p>
        {"count: "}
        {count}
      </p>
      <button onClick={handleAdd}>+1</button>
      <br />
      <button onClick={handleDel}>-1</button>
      <br />
      <input
        value={value}
        onChange={(e) => setValue(Number(e.target.value) || 0)}
      />
      <button onClick={handleAmount}>+N</button>
    </div>
  );
};

export default Counter;
