// import _ from "lodash";
// import moment from "moment";

// import modular components from utils
import { calculate_remindoro_id, Notification, strip_html, isValidUrl, chrome_notify } from "../js/utils.js";

import manifest from "json!../manifest.json";

// chrome bg/event related tasks
chrome.runtime.onInstalled.addListener( initializeInstallEvents );

function initializeInstallEvents () {
    console.log("event page inited ?");

    var REMINDORO_VERSION = manifest.version;

    // init_chrome_events();
    create_context_menus();
    // show the welcome message
    var welcome_msg = {
        title: "Hello from Remindoro - " + REMINDORO_VERSION + " !",
        message: "You can now set reminders for stuffs that matter to you like links to read/activities/notes .... Enjoy!"
    };

    chrome_notify( welcome_msg );
}

init_chrome_events();

function init_chrome_events() {
    // START: CHROME EVENTS

    // chrome handle alarm events
    // CREATE an alarm
    chrome.alarms.create("remindoro-scan", {
        "delayInMinutes": 0.1,
        "periodInMinutes": 1, 
    });

    // listen for the alarm
    // and dig the remindoros from local chrome extension storage and check if we need to show any notifications
    chrome.alarms.onAlarm.addListener( function () {
        chrome.storage.sync.get("REMINDORO",  function (data) {
            // get the  remindoro data
            var remindoro_data = data["REMINDORO"],
                remindoros = remindoro_data && remindoro_data["remindoros"];
                
            // scan the remindoro and check if we need to update the time and notify it
            Notification.scan( remindoros );
            // save the store data to local storage
            chrome.storage.sync.set({ "REMINDORO": remindoro_data }, function () {
                console.log("EVENT PAGE: STORE DATA saved to CHROME");
                // TODO: notification to be shown !!??
            });
        } );
    } );

    // handle browser context menu clicks
    chrome.contextMenus.onClicked.addListener( function (menu_details, tab_details) {
        chrome.storage.sync.get("REMINDORO",  function (data) {
            // get the  remindoro data
            var remindoro_data = data["REMINDORO"],
                remindoros = remindoro_data["remindoros"];

            // before adding we need to check if the link we are trying to save is already there
            var is_link_present = check_remindoro_link( menu_details, tab_details, remindoros );

            if (is_link_present) {
                // we have notified
                // update the remindoros which we got
                remindoro_data["remindoros"] = is_link_present;
            } else {
                // link is not already there
                // we need to add it
                var to_add = handleContextMenuClick( menu_details, tab_details, remindoros );

                // push the remindoros to add
                remindoros.push( to_add );    
                // update the remindoros
                remindoro_data["remindoros"] = remindoros;
            }
            
            // save the store data to local storage
            chrome.storage.sync.set({ "REMINDORO": remindoro_data }, function () {
                console.log("EVENT PAGE: NEW REMINDORO saved to CHROME");
                chrome_notify({
                    title: "Added Successfully",
                    message: to_add.title
                });
            });
        } );
    } );

    // handle when a "Read Now" button is clicked on notification
    chrome.notifications.onButtonClicked.addListener( function (notification_id, button_index) {
        console.log("button clicked ", notification_id, button_index);
        console.log(Notification.notification_ids);
        // getting the remindoro id from the notificatin id
        var ro_id = _.findKey( Notification.notification_ids, function (n_id, key) {
            return n_id == notification_id;
        } );
        console.log("ro id ", ro_id);
        // getting remindoros from the storage
        chrome.storage.sync.get("REMINDORO",  function (data) {
            // get the  remindoro data
            var remindoro_data = data["REMINDORO"],
                remindoros = remindoro_data["remindoros"];

            // finding the remindoro matching the id
            var ro = _.find( remindoros, function (ro) {
                return ro.id == ro_id;
            } );
            console.log("note value ", ro, ro.note);
            if ( isValidUrl(ro.note) ) {
                // if valid url; opening the link in new tab
                chrome.tabs.create({ url: ro.note });
            }
            // either way we need to close the notification
            chrome.notifications.clear( notification_id );
        } );
    } );
    // END: CHROME EVENTS
}

// creates context menus for different use cases => normal one, for links, highlighted text
function create_context_menus () {
    // creating a page context menu
    chrome.contextMenus.create( {
        id: "remindoro-page-context-menu",
        contexts: ["page", "link"],
        title: "Add to Remindoro"
    }, function () {
        console.log("context menu created ? ", arguments);
    });

    // creating a highlight context menu
    chrome.contextMenus.create( {
        id: "remindoro-highlight-context-menu",
        contexts: ["selection"],
        title: "Save Text to Remindoro"
    }, function () {
        console.log("context menu created ? ", arguments);
    });
}



function handleContextMenuClick (menu_details, tab_details, remindoros) {
    console.log("context menu clicked !?!?", menu_details, tab_details);
    var remindoro_details = {};
    // we will be handling two types of context menus
    // page/link action => adding the page url as note, title as title
    // highlighted action => title - url as title, highlighted text as body
    var context_id = menu_details.menuItemId,
        page_action = (context_id == "remindoro-page-context-menu"),
        highlight_action = (context_id == "remindoro-highlight-context-menu");

    if (page_action) {
        // page/link action
        // title => page title
        // note => url of the page
        var title = tab_details.title,
            note = tab_details.url;

    } else if (highlight_action) {
        // highlight action
        // title => page title - url
        // note => highlighted text
        var title = tab_details.title + " - " + tab_details.url,
            note = menu_details.selectionText || "";
    }

    // save the  remindoro details
    remindoro_details = {
        title: title,
        note: note
    };

    const add_id = calculate_remindoro_id( remindoros );
    // return the new remindoro to be added
    const remindoro_to_add = {
        id: add_id,
        title: remindoro_details.title,
        type: "note",
        note: remindoro_details.note,
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
    };

    return remindoro_to_add;
}

// check if remindoro link already present
function check_remindoro_link (menu_details, tab_details, remindoros) {

    // we will be handling two types of context menus
    // page/link action => adding the page url as note, title as title
    // highlighted action => title - url as title, highlighted text as body
    var context_id = menu_details.menuItemId,
        page_action = (context_id == "remindoro-page-context-menu"),
        highlight_action = (context_id == "remindoro-highlight-context-menu");

    // if not page action we will return false
    if (!page_action) {
        return false;
    }

    var title = tab_details.title,
        note = tab_details.url;

    // we are getting a page action only here
    // note here we need to check if the url is already present in the existing remindoros
    var already_saved_link = _.findIndex( remindoros, function (ro) {
        var link = strip_html(ro.note);
        return note == link;
    } );

    if (already_saved_link < 0) {
        // it is not present
        return false;
    }

    // it seems the link is already saved we need to update the 
    // update the time with the index we have
    remindoros[ already_saved_link ].updated = Date.now();
    // update the title in case we get a updated title
    remindoros[ already_saved_link ].title = title;

    // notify
    chrome_notify({
        title: "Updated Successfully!",
        message: note
    })

    // return the remindoros
    return remindoros;
}