// action types
export const ADD_TODO = "ADD_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";

// other constants
export const VisibilityFilters = {
    SHOW_ALL: "SHOW_ALL",
    SHOW_COMPLETED: "SHOW_COMPLETED",
    SHOW_ACTIVE: "SHOW_ACTIVE"
};

let todo_counter = 0;

// action creators
// actions: app => store, updates data from the app to the store
export function addTodo(text) {
    return {
        type: ADD_TODO,
        id: todo_counter++,
        text: text
    };
}

export function toggleTodo(index) {
    return {
        type: TOGGLE_TODO,
        // we will be passing an index to identify the todo and toggle its state
        index: index
    };
}

export function setVisibilityFilter(filter) {
    return {
        type: SET_VISIBILITY_FILTER,
        filter: filter
    };
}

export function changePorumai(text) {
    return {
        type: "CHANGE_PORUMAI",
        porumai: text
    }
}