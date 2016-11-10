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
            reminder: {
                time: null, // if null no alarm set,
                is_repeat: "true/false", // status if the alarm is recurring
                repeat: {
                    interval: "minutes/hours/day/month",
                    time: "1"
                }
            } 
        }
    ],
    // current selected remindoro; holds a copy of current selected remindoro which is edited
    current_selected_remindoro: {
        id: 5
    }
}
*/

// for now we have all the actions here; later we can move it to seperate files

// action to change the tab
export const changeTab = (tab) => {
    // each action will have a type describing what action to do, and 
    // the data needed to perform that action
    return {
        type: "CHANGE_TAB",
        tab: tab
    };
};

// sort remindoros based on updated time
export const sortRemindoros = () => {
    return {
        type: "SORT_REMINDOROS"
    };
};

// adding a new remindoro
export const addRemindoro = (current_id) => {
    return {
        type: "ADD_REMINDORO",
        id: current_id
    };
};

// adding new remindoro with details
export const addRemindoroWithDetails = (id, details) => {
    return {
        type: "ADD_REMINDORO_WITH_DETAILS",
        id: id,
        details: details
    };
};

// selecting a remidoro for editing
export const selectRemindoro = (id) => {
    return {
        type: "SELECT_REMINDORO",
        id: id
    };
};

// update title
export const updateTitle = (id, title) => {
    return {
        type: "UPDATE_TITLE",
        id: id,
        title: title
    };
};

// update note
export const updateNote = (id, note) => {
    return {
        type: "UPDATE_NOTE",
        id: id,
        note: note
    };
};

// updating reminder status (on/off)
export const updateReminderStatus = (id, status, reminder_time) => {
    return {
        type: "UPDATE_REMINDER_STATUS",
        id: id,
        status: status,
        reminder_time: reminder_time
    };
};

// updating repeat status (on/off)
export const updateRepeatStatus = (id, status) => {

    let interval, time;

    // if repeat is turned on, let us get the default values from the dom
    if (status) {
        interval = $("#options-modal").find("#repeat-interval").val();
        time = $("#options-modal").find("#repeat-time").val();
    } else {
        interval = false;
        time = false;
    }

    return {
        type: "UPDATE_REPEAT_STATUS",
        id: id,
        status: status,
        interval: interval,
        time: time
    };
};

// delete remindoro
export const deleteRemindoro = (id) => {
    return {
        type: "DELETE_REMINDORO",
        id: id
    };
};

// update remindoros which are sent by the event/bg page
export const updateRemindoros = (remindoros) => {
    return {
        type: "UPDATE_REMINDOROS",
        remindoros: remindoros
    };
};




