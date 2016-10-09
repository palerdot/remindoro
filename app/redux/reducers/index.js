// main reducer file; following are the reducers list
// currentTab => changes current tab to the given tab

import { combineReducers } from "redux";


// each reducer is given the current state and the action to perform
// note all the reducers will be called by redux; so we need to perform appropriate action based on the type
// NOTE: this reducer will just get the current tab as STATE;
// maps to the same name as the function by default
const current_tab = (state = "home", action) => {

    if (action.type == "CHANGE_TAB") {
        // our changing tab logic goes here
        // return the current tab given to this reducer
        return action.tab;
    }

    // by default return the current state
    return state;

};

// reducer for remindoros; gets empty array as an initial state
const remindoros = (state = [], action) => {

    switch (action.type) {

        case "ADD_REMINDORO":
            // return a new copy of the remindoro array by adding a new entry
            // sample remindoro entry

            return [
                ...state,
                {
                    id: action.id,
                    title: "porumai! new remindoro " + Date.now(),
                    type: "note",
                    note: "", // if note contains the string here
                    list: [], // if list contains the list details
                    created: Date.now(),
                    updated: Date.now(),
                    alarm: {
                        time: false, // if false no alarm set,
                        is_recurring: false, // status if the alarm is recurring
                        recurring: {
                            interval: false,
                            time: false
                        }
                    } 
                }
            ];
            break;

    }

    // return the default state
    return state;

};

// our main reducer
// a combination of all the required reducers
const remindoroReducer = combineReducers({
    current_tab,
    remindoros
});

export default remindoroReducer;