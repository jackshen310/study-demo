import { Provider } from "react-redux";
import Counter from "./counter";
import store from "./store";

const ReduxDemo = () => {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
};

export default ReduxDemo;
