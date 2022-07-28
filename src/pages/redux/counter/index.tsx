import React, { useState } from "react";
import { useEffect } from "react";
import store from "./store";
import { decremented, incremented } from "./store/actions";

const Counter = () => {
  const [count, setCount] = useState(0);

  const handleAdd = () => {
    store.dispatch(incremented());
  };
  const handleDel = () => {
    store.dispatch(decremented());
  };

  useEffect(() => {
    store.subscribe(() => {
      console.log(store.getState());
      setCount(store.getState().value);
    });
  }, []);
  return (
    <div style={{ marginLeft: 100 }}>
      <p>count: {count}</p>
      <button onClick={handleAdd}>+1</button>
      <br />
      <button onClick={handleDel}>-1</button>
    </div>
  );
};

export default Counter;
