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
import { changeTab, addRemindoro } from "../redux/actions/";

// menu options; for now we will define the menu options here
// later we can move into a seperate location which is appropriate
// for now we are mapping only the icon names
const menu = {
    "add": "add_circle_outline",
    "home": "home",
    // "notes": "content_paste",
    // "lists": "format_list_bulleted",
    // "notifications": "notifications_active"
    "notifications": "event"
};

const mapStateToProps = (state, ownProps) => {
    console.log("app state ", state);
    // return the props for App component with the required state
    return {
        menu: menu,
        current_tab: state.current_tab,
        remindoros: state.remindoros
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    // return the props for App component with required dispatch methods
    return {
        // handles creating a new remindoro
        handleAddRemindoro: () => {
            console.log("[dispatch][add remindoro]");
            dispatch( addRemindoro() );
            // also change the tab to home
            dispatch( changeTab("home") );
        },

        // handles the navigation clicks of home, notifications etc
        onNavClick: (tab) => {
            console.log("[dispatch][changeTab]", tab);
            dispatch( changeTab(tab) );
        },

        // handle title change
        handleTitleChange: (id, title) => {
            console.log("handling title change ", id, title);
        },

        // handle Note Change
        handleNoteChange: (id, note) => {
            console.log("handling note change ", id, note);
        },

        // handling menu click for a remindoro
        handleMenuClick: (id) => {
            console.log("handling menu click ", id);
            // scroll to the edited remindoro
            let animate_time = 750,
                marginTop = 50,
                current_ro_offset = $("#remindoro-" + id).offset().top,
                scrollTo = current_ro_offset - marginTop;
            $("#remindoros").animate( {
                scrollTop: scrollTo + "px"
            }, animate_time );
            // dispatch action to get the current edited remindoro
            // update the current remindoro details which will reflect in the modal
            // then updating the modal
            $("#options-modal").openModal();
        }

    };
};

// we will get all the properties from mapStateToProps, mapDispatchToProps
// we can access the props, and dispatch methods with appropriate names
let App = (props) => {
    // { current_tab, remindoros, onNavClick, handleAddRemindoro, handleTitleChange, handleNoteChange }

    return (
       <div className="col s12">
            <Navigator 
                menu={props.menu} 
                current_tab={props.current_tab} 
                onClick={props.onNavClick}
                onAddClick={props.handleAddRemindoro} 
            />
            <Remindoro 
                remindoros={props.remindoros}
                onTitleChange={props.handleTitleChange}
                onNoteChange={props.handleNoteChange} 
                onMenuClick={props.handleMenuClick}
            />
            <BottomModal />     
       </div>
       
    );

};

App = connect( mapStateToProps, mapDispatchToProps )(App);

export default App;