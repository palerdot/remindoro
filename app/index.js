import React from 'react';
import ReactDOM from 'react-dom';
// note: important to import _, otherwise we will end up with lodash!!!
import _ from "lodash";

import { Provider } from "react-redux";
import { createStore } from "redux";

import remindoroReducer from "./redux/reducers";

import "./general-initializer.js";

import App from "./Components/App";

console.log("Porumai! building remindoro");
// sniff if we are running as a chrome extension
let is_chrome_extension = chrome && chrome.storage;

// defining the store
// we will initialize after getting initial data from chrome
let store = false;

// subscription for handling store changes
let subscription = false;

// main app object
let REMINDORO = {

    // count of total remindoros; used for generating unique ids by auto incrementing
    total_remindoros: 0,

    initialize: function (chrome_local_data) {

        console.log("CHROME DATA ", chrome_local_data, this, chrome.runtime.lastError);
        
        let initial_data = chrome_local_data && chrome_local_data["REMINDORO"];
        let ros = (initial_data && initial_data.remindoros) ? initial_data.remindoros : [];
        // calculating total remindoro count and updating the count
        let max_id_remindoro = _.maxBy( ros, function (data) {
            return data.id;
        } );

        let remindoro_count = 0;

        if (max_id_remindoro) {
            console.log("max id remindoro ", max_id_remindoro);
            // if we have a remindoro with max id we will add that as remindoro_count
            remindoro_count = max_id_remindoro.id;
        }

        // update the  total remindoros
        this.total_remindoros = remindoro_count;

        store = createStore( remindoroReducer, initial_data );
        // add subscription to store changes
        subscription = store.subscribe( REMINDORO.handleSubscription ); 
        // starting the app
        this.start();

    },

    start: function () {
        // render app
        try {
            this.renderApp();    
        } catch (e) {
            handleError(e);
        }
        
    },

    renderApp: function () {

        let id_counter = this.total_remindoros;

        ReactDOM.render(
            <Provider store={store}>
                <App id_counter={id_counter} />
            </Provider>,
            document.getElementById("remindoro-app")
        );
    },

    // handle store changes
    handleSubscription: function () {
        if (!is_chrome_extension) {
            // do not sync with chrome storage
            return;
        }
        // save the store data to local storage
        chrome.storage.sync.set({ "REMINDORO": store.getState() }, function () {
            console.log("STORE DATA saved to CHROME");
        });
    }

};

function handleError (e) {
    console.error('error: ' + e.message);
    Materialize.toast("Error " + e.message, 3000);
    Materialize.toast("Please notify the error through chrome web store or to - palerdot@gmail.com", 13000);
}

try {
    if (is_chrome_extension) {
        // we are dealing with a chrome extension; init normally

        // get current locally stored item from chrome
        // our data is within the key called "REMINDORO" // caps
        chrome.storage.sync.get("REMINDORO",  REMINDORO.initialize.bind(REMINDORO) );    
    } else {
        // we are probably running in the browser, we will initialize differently
        REMINDORO.initialize({})
    }
} catch (e) {
    handleError(e);
}










