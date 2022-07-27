import { INCREMENT, DECREMENT } from "./types";
const counterReducer = (state = { value: 0 }, action: any) => {
  switch (action.type) {
    case INCREMENT:
      return { value: state.value + 1 };
    case DECREMENT:
      return { value: state.value - 1 };
    default:
      return state;
  }
};

export default counterReducer;
