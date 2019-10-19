import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, compose } from "redux";
import root from "./main/duck/reducer";
import Router from "./main/components/Router";

const rootReducer = combineReducers({
  root
});

const composed = window.__REDUX_DEVTOOLS_EXTENSION__
  ? compose(window.__REDUX_DEVTOOLS_EXTENSION__())
  : compose();

const store = createStore(rootReducer, composed);

const App = () => (
  <Provider store={store}>
    <Router />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("root"));
