import { Action } from "redux";
import * as ActionTypes from "./types";

export type CounterCaption = "First" | "Second" | "Third";

export interface CounterAction extends Action {
  type: string;
  counterCaption: CounterCaption;
}

export const increment = (counterCaption: CounterCaption) => {
  return {
    type: ActionTypes.INCREMENT,
    counterCaption: counterCaption,
  };
};

export const decrement = (counterCaption: CounterCaption) => {
  return {
    type: ActionTypes.DECREMENT,
    counterCaption: counterCaption,
  };
};
