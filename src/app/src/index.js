import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createStore, combineReducers, compose, applyMiddleware } from "redux";

import root from "./main/duck/reducer";
import Router from "./main/components/Router";
import { getInfo } from "./main/duck/thunks";

const rootReducer = combineReducers({
  root
});

const composed = window.__REDUX_DEVTOOLS_EXTENSION__
  ? compose(
      applyMiddleware(thunkMiddleware),
      window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  : compose(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, composed);

const App = () => (
  <Provider store={store}>
    <Router />
  </Provider>
);

store.dispatch(getInfo());

ReactDOM.render(<App />, document.getElementById("root"));
