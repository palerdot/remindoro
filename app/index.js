import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from "react-redux";
import { createStore } from "redux";
import remindoroReducer from "./redux/reducers";

import "./general-initializer.js";

import App from "./Components/App";

console.log("Porumai! building remindoro");

// defining the store
let store = createStore( remindoroReducer );

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("remindoro-app")
);