// main store redux object
// some of the features of the react store
// The Store is the object that brings them together. The store has the following responsibilities:
//  - Holds application state;
//  - Allows access to state via getState();
//  - Allows state to be updated via dispatch(action);
//  - Registers listeners via subscribe(listener);
//  - Handles unregistering of listeners via the function returned by subscribe(listener)

import { createStore } from "redux";
import todoApp from "./reducer";

import { addTodo, toggleTodo, changePorumai, setVisibilityFilter, VisibilityFilters } from "./actions";

let store = createStore( todoApp );

export default store;

// logging the initial state
console.log( "initial state", store.getState() );

// every time the state changes, log it
let unsubscribe = store.subscribe( () => {
    console.log( store.getState() );
} );

// stop listening to state updates
unsubscribe();
