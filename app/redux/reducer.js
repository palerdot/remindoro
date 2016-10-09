// reducer describes how actions transforms the state of the data in the store

import { combineReducers } from 'redux';
import { ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from "./actions";

const { SHOW_ALL } = VisibilityFilters;

// reducer acting on the visibility filter
function visibilityFilter ( state = SHOW_ALL, action ) {
    console.log("EXECUTING visibilityFilter reducer ", action.type);
    // default state is SHOW_ALL
    if (action.type == SET_VISIBILITY_FILTER) {
        // return the filter
        return action.filter;
    }
    // by default return state
    return state;
}

// reducer action only on the todos
function todos( state = [], action ) {

    console.log("EXECUTING todos reducer ", action, action.type, state);

    switch (action.type) {

        case ADD_TODO:

            return [
                // make a new array with existing state
                ...state,
                // and adding the following value
                {
                    text: action.text, // update the text
                    id: action.id, // update the id
                    completed: false
                }
            ]

            break;

        case TOGGLE_TODO: 

            // .map creates a new array
            return state.map( (todo, index) => {
                if (index == action.index) {
                    console.log("mutating ", todo, index, action.index);
                    // our todos match
                    // changing the todo status
                    return Object.assign( {}, todo, {
                        completed: !todo.completed
                    } );
                }
                return todo;
            } );

            break;

        default:
            return state;

    }

}



// main reducer; action on visibilityFilter and todos
// now replaced by combineReducers
function todoApp ( state = {}, action ) {
    console.log("executing reducer ", state, action);
    return {
        // use the reducer for visibilityFilter
        visibilityFilter: visibilityFilter( state.visibilityFilter, action ),
        // use the reducer for todos
        todos: todos( state.todos, action ),
        // porumai: porumai( state.porumai, action )
    }
}

function porumai(state, action) {
    console.log("PORUMAI! reducer ", arguments);
    if (action.type = "CHANGE_PORUMAI") {
        return action.porumai;
    }
    // here create a new state and perform the operations without mutating the original state
    // return "porumai";
    return state;
}

/*const todoApp = combineReducers({
    visibilityFilter,
    todos
});*/

export default todoApp;

