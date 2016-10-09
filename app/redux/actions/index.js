// sample state structure
/*
{
    current_tab: "home", // keeps track of the current select tab
    // list of remindoros
    remindoros: [
        // one sample remindoro structure
        {
            id: "",
            type: "list/note",
            note: "", // if note contains the string here
            list: [

            ], // if list contains the list details
            created: "",
            updated: "",
            alarm: {
                time: null, // if null no alarm set,
                is_recurring: "true/false", // status if the alarm is recurring
                recurring: {
                    interval: "minutes/hours/day/month",
                    time: "1"
                }
            } 
        }
    ]
}
*/

// for now we have all the actions here; later we can move it to seperate files

// action to change the tab
export const changeTab = function (tab) {
    // each action will have a type describing what action to do, and 
    // the data needed to perform that action
    return {
        type: "CHANGE_TAB",
        tab: tab
    };
};

let remindoro_id = 1;

// adding a new remindoro
export const addRemindoro = function () {
    return {
        type: "ADD_REMINDORO",
        id: remindoro_id++
    };
};




