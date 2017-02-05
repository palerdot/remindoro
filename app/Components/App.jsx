// main app component
// <Navigation> => top menu
// <Remindoro> => main remindoro view

import React from "react";

// import required components
import Navigator from "./Navigator";
import Remindoro from "./Remindoro";
import BottomModal from "./BottomModal";

// for connecting this componenet to the store
import { connect } from "react-redux";
import { changeTab, sortRemindoros, addRemindoro, selectRemindoro, updateReminderStatus, updateRepeatStatus, updateTitle, updateNote, deleteRemindoro } from "../redux/actions/";

// menu options; for now we will define the menu options here
// later we can move into a seperate location which is appropriate
// for now we are mapping only the icon names
const menu = {
    "add": "add_circle_outline",
    "home": "home",
    // "notes": "content_paste",
    // "lists": "format_list_bulleted",
    // "notifications": "notifications_active"
    "events": "event"
};

const filterRemindoros = (remindoros, tab) => {

    let ros = remindoros;

    const is_home_tab = (tab == "home"),
            is_events_tab = (tab == "events");

    if (is_events_tab) {
        let filtered_ros = _.filter( ros, function (ro) {
            return ro.reminder.time;
        } );
        // sort the filtered array by update time
        ros = _.sortBy( filtered_ros, function (ro) {
            const reminder_time = new Date(ro.reminder.time).getTime(),
                    current_time = new Date().getTime(),
                    isPast = (current_time - reminder_time) > 0;

            return isPast ? Infinity : reminder_time;
        } );
    }

    return ros;
};

const mapStateToProps = (state, ownProps) => {
    // return the props for App component with the required state
    return {
        menu: menu,
        current_tab: state.current_tab,
        // remindoros: state.remindoros,
        remindoros: filterRemindoros( state.remindoros, state.current_tab ),
        current_selected_remindoro: state.current_selected_remindoro,
        id_counter: ownProps.id_counter
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    // return the props for App component with required dispatch methods
    return {

        // dispatch "changeTab" action as "home" at the start to sort remindoros in right order
        initializeHomeScreen: () => {
            dispatch( changeTab("home") );
        },

        // handles creating a new remindoro
        handleAddRemindoro: (current_id) => {
            dispatch( addRemindoro(current_id) );
            // also change the tab to home
            dispatch( changeTab("home") );
            // scroll to the top of the screen in case we are at the bottom
            $("#remindoros").animate( { scrollTop: "0px" }, 0 );
        },

        // handles the navigation clicks of home, notifications etc
        onNavClick: (tab) => {
            dispatch( changeTab(tab) );
        },

        // handle title change; for now we are updating the title
        // TODO: later compare changes and update only if changed
        handleTitleChange: (id, title) => {
            dispatch( updateTitle(id, title) );
        },

        // handle Note Change
        handleNoteChange: (id, note, orig) => {
            dispatch( updateNote(id, note) );
        },

        // handling menu click for a remindoro
        handleMenuClick: (id) => {

            // dispatch an action to select the current remindoro
            dispatch( selectRemindoro(id) );

            // scroll to the edited remindoro
            let animate_time = 750,
                marginTop = 50,
                current_ro_offset = $("#remindoro-" + id).offset().top,
                ros_offset = $("#remindoros").scrollTop(),
                scrollTo = ros_offset + current_ro_offset - marginTop;

            $("#remindoros").animate( {
                scrollTop: scrollTo + "px"
            }, animate_time );
            
            // dispatch action to get the current edited remindoro
            // update the current remindoro details which will reflect in the modal
            // then updating the modal
            $("#options-modal").openModal();
        },

        // updates reminder status when it is changed
        // NOTE: this function will be triggered from two places; on from normal on/off switch
        // other from the onChange event of flatpickr! validate if id is present before triggering the action
        handleReminderStatus: (id, status, reminder_time) => {
            // dispatch reminder status change
            dispatch( updateReminderStatus(id, status, reminder_time) );
        },

        // triggered by flatpickr timechange
        // IMPORTANT: This will be triggered by react whenever bottom modal is loaded
        // we need to double check if an remindoro id is passed and it has reminder status switched on
        handleReminderTimeChange: (id, status, reminder_time) => {
            if ( !(id && status) ) {
                // do not proceed; it will be triggered when there is no current selected remindoro
                return;
            }
            // update reminder time change
            dispatch( updateReminderStatus(id, true, reminder_time) );
        },

        // updates repeat status when it is changed
        handleRepeatStatus: (id, status) => {
            // dispatch repeat status change
            dispatch( updateRepeatStatus(id, status) );
        },

        // delete the remindoro
        deleteRemindoro: (id) => {
            // close the bottom modal
            $("#options-modal").closeModal();
            // dispatch the delete action
            dispatch( deleteRemindoro(id) );
            // show a toast message
            Materialize.toast("Deleted !", 2000, 'center-align');
        }

    };
};

// we will get all the properties from mapStateToProps, mapDispatchToProps
// we can access the props, and dispatch methods with appropriate names
let App = (props) => {

    return (
       <div className="col s12">
            <Navigator 
                menu={props.menu} 
                current_tab={props.current_tab} 
                id_counter={props.id_counter}
                onClick={props.onNavClick}
                onAddClick={props.handleAddRemindoro}
                initializeHomeScreen={props.initializeHomeScreen} 
            />
            <Remindoro
                current_tab={props.current_tab} 
                remindoros={props.remindoros}
                onTitleChange={props.handleTitleChange}
                onNoteChange={props.handleNoteChange} 
                onMenuClick={props.handleMenuClick}
            />
            <BottomModal
                remindoros={props.remindoros}
                current_selected_remindoro={props.current_selected_remindoro}
                onReminderStatusChange={props.handleReminderStatus}
                onReminderTimeChange={props.handleReminderTimeChange}
                onRepeatChange={props.handleRepeatStatus}
                onDelete={props.deleteRemindoro}
            />     
       </div>
    );

};

App = connect( mapStateToProps, mapDispatchToProps )(App);

export default App;