// main reducer file; following are the reducers list
// current_tab => keeps track of current tab
// remindoros => list of current remindoros
// current_selected_remindoro => remindoro clicked for which menu is showed

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
                    id: calculate_remindoro_id(state),
                    title: "",
                    type: "note",
                    note: "", // if note contains the string here
                    list: [], // if list contains the list details
                    created: Date.now(),
                    updated: Date.now(),
                    reminder: {
                        time: false, // if false no alarm set,
                        is_repeat: false, // status if the alarm is recurring
                        repeat: {
                            interval: false,
                            time: false
                        }
                    } 
                }
            ];
        break;

        // add remindoro with pre defined details (from browser)
        case "ADD_REMINDORO_WITH_DETAILS":
            // return a new copy of the remindoro array by adding a new entry
            // filling id, title, note if present in the details
            return [
                ...state,
                {
                    id: calculate_remindoro_id(state),
                    title: (action.details && action.details.title) ? action.details.title : "",
                    type: "note",
                    note: (action.details && action.details.note) ? action.details.note : "",
                    list: [], // if list contains the list details
                    created: Date.now(),
                    updated: Date.now(),
                    reminder: {
                        time: false, // if false no alarm set,
                        is_repeat: false, // status if the alarm is recurring
                        repeat: {
                            interval: false,
                            time: false
                        }
                    } 
                }
            ];
        break;

        // update title
        case "UPDATE_TITLE":

            // map through the remindoros (to return a new array), 
            // and change the title if the id matches
            return state.map( (ro) => {

                // if the id does not match; return the remindoro as it is 
                if (ro.id != action.id) {
                    return ro;
                }

                // if the id matches change the title and return the ro
                ro.title = action.title;
                // update "updated" time
                ro.updated = Date.now();

                return ro;
            } );            

        break;

        // update note
        case "UPDATE_NOTE":

            // map through the remindoros (to return a new array), 
            // and change the title if the id matches
            return state.map( (ro) => {

                // if the id does not match; return the remindoro as it is 
                if (ro.id != action.id) {
                    return ro;
                }

                // if the id matches change the title and return the ro
                ro.note = action.note;
                // update "updated" time
                ro.updated = Date.now();

                return ro;
            } );            

        break;

        // updates the status of reminder time
        case "UPDATE_REMINDER_STATUS":

            // map through the remindoros (to return a new array), 
            // and change the reminder value if the id matches
            return state.map( (ro) => {

                // if the id does not match; return the remindoro as it is 
                if (ro.id != action.id) {
                    return ro;
                }

                // if the id matches; change the reminder status and return the ro
                // for now make a boolean status; later it should be a default reminder time
                console.log("updating reminder status ", action.reminder_time, typeof(action.reminder_time));
                ro.reminder.time = action.reminder_time;
                // also turn off repeat status if reminder is turned off
                if (!action.reminder_time) {
                    ro.reminder.is_repeat = false;
                }
                // update "updated" time
                ro.updated = Date.now();

                return ro;
            } );

        break;

        // updates the status of repeat
        case "UPDATE_REPEAT_STATUS":

            // map through the remindoros (to return a new array), 
            // and change the reminder value if the id matches
            return state.map( (ro) => {

                // if the id does not match; return the remindoro as it is 
                if (ro.id != action.id) {
                    return ro;
                }

                // repeat status
                ro.reminder.is_repeat = action.status;
                // repeat time and interval
                ro.reminder.repeat = {
                    interval: action.interval,
                    time: action.time
                };
                // update "updated" time
                ro.updated = Date.now();

                return ro;

            } );
        break;

        // deleting remindoro !!
        case "DELETE_REMINDORO":

            // return a copy of remindoro array without the remindoro to be deleted
            return state.filter( (ro) => (ro.id != action.id) );

        break;

        case "CHANGE_TAB":

            const home_screen = (action.tab == "home"),
                  events_screen = (action.tab == "events");
            console.log("SORTING REMINDOROS !!??? ");

            if (home_screen) {
                // sorting remindoros based on updated time when initializing home screen
                return state.slice().sort( function (a, b) {
                    // sort by updated time in descending order
                    return b.updated - a.updated;
                } );    
            }
            
            // else return actual state by default
            return state;
        break;

        // update remindoros sent by the event page
        case "UPDATE_REMINDOROS":
            // map through the remindoros (to return a new array), 
            // and replace the remindoro which are updated by event page
            return state.map( (ro) => {

                // let us find if we have a match for this remindoro in the changed items
                var updated_ro = _.find( action.remindoros, function (updated) {
                    return updated.id == ro.id;
                } );

                if (updated_ro) {
                    // return the updated ro instead of the original ro
                    return updated_ro;
                }

                // else by default return the same remindoro
                return ro;
            } );
            break;

        default:
            return state;

    }

    // return the default state
    return state;

};

// reducer for current selected remindoro; returns empty object initially
// whenever a remindor is selected and menu is shown, the corresponding remindoro is fetched
// and made as current selected remindoro
const current_selected_remindoro = (state = false, action) => {

    if (action.type == "SELECT_REMINDORO") {
        return action.id;
    }

    // by default return the empty object as current remindoro
    return state;

};

// our main reducer
// a combination of all the required reducers
// we are using our own reducer since current_selected_remindoro reducer is dependent on remindoros

const remindoroReducer = combineReducers({
    current_tab,
    remindoros,
    current_selected_remindoro 
});

// custom reducer; if our state is not compartmentalized we can use this; for now using combine reducers
/*function remindoroReducer (state = {}, action) {
    // our final reducer will return an object
    // each key will represent a state, value which takes an input and calculates the next state for a given state
    return {
        current_tab: current_tab( state.current_tab, action ),
        remindoros: remindoros( state.remindoros, action ),
        current_selected_remindoro: current_selected_remindoro( state.current_selected_remindoro, action )
    };
}*/

// util function to generate uniq remindoro id from given set of reminders
function calculate_remindoro_id (remindoros) {

    let remindoro_count = 0;

    if (!remindoros || remindoros.length == 0) {
        // starting id counter from 1
        return remindoro_count + 1;
    }

    let max_id_remindoro = _.maxBy( remindoros, function (data) {
        return data.id;
    } );

    if (max_id_remindoro) {
        remindoro_count = max_id_remindoro.id;
    }

    // increment count by one for uniqueness
    return remindoro_count + 1;
}

export default remindoroReducer;