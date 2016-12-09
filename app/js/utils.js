// collection of utility scripts used for remindoro

import _ from "lodash";
import moment from "moment";

// calculates unique remindoro id for a given set of remindoros
// takes a set of remindoros; calculates max id among the given remindoros 
// and returns as remindoro_id which will be auto-incremented
export function calculate_remindoro_id (remindoros) {

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

// checks for reminder time; COPIED from plain events.js bg page
/*export function check (ro) {

    // first let us take the current time
    var current_time = new Date().getTime(),
        // buffer time 15 minutes. i.e we will notify if the remindoro is atmost 15 minutes old
        buffer = 15 * 60 * 1000,
        ro_time = ro.reminder.time ? new Date(ro.reminder.time).getTime() : false,
        time_delta = (current_time - ro_time),
        is_repeat = ro.reminder.is_repeat;

    // CASE 1: no reminder scheduled
    // RESULT: WILL NOT NOTIFY; returning REMINDORO
    if (!ro_time) {
        // return the remindoro as it is
        return ro;
    }

    // CASE 2: NON REPEATABLE reminders
    if (!is_repeat) {
        // CASE 3: remindoro is in future
        // RESULT: WILL NOT NOTIFY; returning REMINDORO
        if (time_delta < 0) {
            // returning the remindoro as it is 
            return ro;
        }

        // we have this remindoro scheduled at some time; we need to check if it is atmost 15 mins fresh
        var to_be_notified = ( time_delta <= buffer );

        // CASE 4: remindoro is 15 mins (buffer time) past. not fresh
        // RESULT: WILL NOT NOTIFY; returning REMINDORO
        if (!to_be_notified) {
            return ro;
        }

        // CASE 5: remindoro is atmost 15 mins (buffer time) fresh
        // RESULT: WILL NOTIFY
        ro.reminder.time = false;
    } else {

        // CASE 6: REPEATABLE remindoros
        // short repeat => minutes, hours; long repeat => days, months
        var is_short_repeat = _.indexOf(["minutes", "hours"], ro.reminder.repeat.interval) > -1,
            is_long_repeat = _.indexOf(["days", "months"], ro.reminder.repeat.interval) > -1;

        // CASE 7: short repeat => minutes, hours
        if (is_short_repeat) {
            console.log("SHORT REPEAT");
            // determines if the reminder time is in the same day exactly to the scheduled "minute"
            var is_past = moment().isAfter( ro.reminder.time, "minute" ),
                is_present = moment().isSame( ro.reminder.time, "minute" );

            // CASE 7: exactly scheduled at current minute; short repeating remindoro
            // RESULT: WILL NOTIFY
            if (is_present) {
                ro.reminder.time = moment( new Date(ro.reminder.time) )
                                        .add( ro.reminder.repeat.time, ro.reminder.repeat.interval )
                                        .format();
            } else if (is_past) {
                // CASE 8: reminder time is in past; short repeating remindoro

                // if the reminder time is already past when our event page scans, we will schedule 
                // the next reminder from the current minute

                
                ro.reminder.time = moment()
                                    .add( ro.reminder.repeat.time, ro.reminder.repeat.interval )
                                    .format();
                
                // RESULT: WILL NOT NOTIFY
                return ro;
            } else {
                // CASE 9: remindoro is in future; short repeat remindoro
                // RESULT: WILL NOT NOTIFY
                console.log("NOT PAST OR PRESENT FOR SHORT REPEAT. probably future");
                // do not notify
                return ro;
            }
            
        } else if (is_long_repeat) {
            // CASE 9: Long repeat remindoro
            // long repeat => days, months
            
            // we will notify on the exact time scheduled; 
            // and will not update the reminder time till the day is done
            // determines if the reminder time is in the same day exactly to the scheduled "DAY"
            // is_past => checks if current moment is after the given moment
            var is_past = moment().isAfter( ro.reminder.time, "day" ),
                is_today = moment().isSame( ro.reminder.time, "day" );

            // CASE 10: scheduled today for long repeat
            if (is_today) {
                // CASE 11: we will exactly notify on the scheduled minute
                var is_current_minute = moment().isSame( ro.reminder.time, "minute" );
                if (!is_current_minute) {
                    //RESULT: WILL NOT notify
                    return ro;
                }
                // CASE 12: current minute for today
                // RESULT: WILL NOTIFY
                console.log("LONG REPEAT CURRENT MINUTE !!?? ", ro.reminder.time);
            } else if (is_past) {

                // CASE 13: scheduled older than today
                // we need to update the next reminder which should be in future
                
                var is_future_reminder_time = false,
                    future_reminder_time = false;

                // looping till we get a future reminder time
                while (!is_future_reminder_time) {
                    // NOTE: we need to do this till we are in the future
                    // we will update the reminder time
                    future_reminder_time = moment( new Date(ro.reminder.time) )
                                                .add( ro.reminder.repeat.time, ro.reminder.repeat.interval );

                    is_future_reminder_time = moment( future_reminder_time ).isAfter();
                }
                // updating reminder time with future reminder time
                ro.reminder.time = future_reminder_time.format();

                //RESULT: WILL NOT NOTIFY
                return ro;
            } else {
                // CASE 14: not past; not present; probably future for long repeat
                console.log("LONG REPEAT FUTURE REMINDER");
                // WILL NOT NOTIFY
                return ro;
            }
        } else {
            // CASE 15: !!!
            // CAUTION: some UNKNOWN unique use case; do not proceed;
            // RESULT: WILL NOT NOTIFY
            return ro;
        }
    }

    // first pushing the remindoro in our list to notify later
    this.to_notify.push( ro );

    // returning the remindoro
    return ro;
}*/

// modular event.js components
// START: Notification Module
export const Notification = {

    // keeps track of chrome notification ids for each remindoro id
    // key is remindoro id; value is chrome notification id
    notification_ids: {

    },

    // list of remindoros to be notified
    to_notify: [],

    // takes the to_notify array and notifies it
    notify: function () {

        var self = this; // save reference

        // before showing a message; send a message to extension about the updated remindoros
        chrome.runtime.sendMessage({updated_remindoros: Notification.to_notify}, function(response) {
            console.log(response);
        });

        _.each( this.to_notify, function (ro) {
            self.show(ro);
        } );

        // clear the notify array
        this.to_notify = [];
    },

    // shows individual notification for each message with specified details
    show: function (ro) {
        var self = this; // save reference

        var ro_noty_id = this.notification_ids[ ro.id ] ? this.notification_ids[ ro.id ] : "";

        // if we have an url in the body we will show read now button;
        var is_note_url = isValidUrl( ro.note ),
            buttons = [];
        if (is_note_url) {
            buttons = [
                {
                    "title": "Read Now"
                }
            ];
        }

        this.notification_ids[ ro.id ] = chrome.notifications.create( ro_noty_id , {
            type: "basic",
            iconUrl: "/images/icon-38.png",
            title: ro.title ? ro.title : "",
            message: ro.note ? strip_html(ro.note) : "",
            buttons: buttons,
            // indicates to force close our notification; not just to dismiss
            requireInteraction: true
        }, function (notification_id) {
            // SAVING the notification id
            self.notification_ids[ ro.id ] = notification_id;
        });
    },

    // checks whether we need to show notification for any upcoming remindoros
    scan: function (remindoros) {
        var self = this; // save reference
        console.log("checking remindoros ", remindoros );
        // clear the alarms to be notified
        this.to_notify = [];
        // go through the remindoros and update the time if they are to be notified
        remindoros = _.map( remindoros, function (ro) {
            return self.check(ro);
        } );
        console.log("NOTIFICATION LIST ", this.to_notify);
        // ok let us notify the remindoros
        this.notify();
        // return the updated remindoros to save it to chrome local state
        return remindoros;
    },

    // MAIN module which decides whether to update the remindoro alarm time and display it using notification
    // takes a single remindoro data and updates it if needed; 
    // also it internally updates an array of remindoros to be updated in "Notification" object so that
    // it can be used for showing notifications
    check: function (ro) {

        // first let us take the current time
        var current_time = new Date().getTime(),
            // buffer time 15 minutes. i.e we will notify if the remindoro is atmost 15 minutes old
            buffer = 15 * 60 * 1000,
            ro_time = ro.reminder.time ? new Date(ro.reminder.time).getTime() : false,
            time_delta = (current_time - ro_time),
            is_repeat = ro.reminder.is_repeat;

        // CASE 1: no reminder scheduled
        // RESULT: WILL NOT NOTIFY; returning REMINDORO
        if (!ro_time) {
            // return the remindoro as it is
            return ro;
        }

        // CASE 2: NON REPEATABLE reminders
        if (!is_repeat) {
            // CASE 3: remindoro is in future
            // RESULT: WILL NOT NOTIFY; returning REMINDORO
            if (time_delta < 0) {
                // returning the remindoro as it is 
                return ro;
            }

            // we have this remindoro scheduled at some time; we need to check if it is atmost 15 mins fresh
            var to_be_notified = ( time_delta <= buffer );

            // CASE 4: remindoro is 15 mins (buffer time) past. not fresh; very past event STILL ALIVE
            // RESULT: WILL NOT NOTIFY; returning REMINDORO by CLEARING remindoro time
            if (!to_be_notified) {
                console.log("clearing past remindoro");
                ro.reminder.time = false;
                
                return ro;
            }

            // CASE 5: remindoro is atmost 15 mins (buffer time) fresh
            // RESULT: WILL NOTIFY
            ro.reminder.time = false;
        } else {

            // CASE 6: REPEATABLE remindoros
            // short repeat => minutes, hours; long repeat => days, months
            var is_short_repeat = _.indexOf(["minutes", "hours"], ro.reminder.repeat.interval) > -1,
                is_long_repeat = _.indexOf(["days", "months"], ro.reminder.repeat.interval) > -1;

            // CASE 7: short repeat => minutes, hours
            if (is_short_repeat) {
                // console.log("SHORT REPEAT");
                // determines if the reminder time is in the same day exactly to the scheduled "minute"
                var is_past = moment().isAfter( ro.reminder.time, "minute" ),
                    is_present = moment().isSame( ro.reminder.time, "minute" );

                // CASE 7: exactly scheduled at current minute; short repeating remindoro
                // RESULT: WILL NOTIFY
                if (is_present) {
                    ro.reminder.time = moment( new Date(ro.reminder.time) )
                                            .add( ro.reminder.repeat.time, ro.reminder.repeat.interval )
                                            .format();
                } else if (is_past) {
                    // CASE 8: reminder time is in past; short repeating remindoro

                    // if the reminder time is already past when our event page scans, we will schedule 
                    // the next reminder from the current minute

                    
                    ro.reminder.time = moment()
                                        .add( ro.reminder.repeat.time, ro.reminder.repeat.interval )
                                        .format();
                    
                    // RESULT: WILL NOT NOTIFY
                    return ro;
                } else {
                    // CASE 9: remindoro is in future; short repeat remindoro
                    // RESULT: WILL NOT NOTIFY
                    // console.log("NOT PAST OR PRESENT FOR SHORT REPEAT. probably future");
                    // do not notify
                    return ro;
                }
                
            } else if (is_long_repeat) {
                // long repeat => days, months
                
                // we will notify on the exact time scheduled; 
                // and will not update the reminder time till the day is done
                // determines if the reminder time is in the same day exactly to the scheduled "DAY"
                // is_past => checks if current moment is after the given moment
                var is_past = moment().isAfter( ro.reminder.time, "day" ),
                    is_today = moment().isSame( ro.reminder.time, "day" );

                // CASE 10: scheduled today for long repeat
                if (is_today) {
                    // CASE 11: we will exactly notify on the scheduled minute
                    var is_current_minute = moment().isSame( ro.reminder.time, "minute" );
                    if (!is_current_minute) {
                        //RESULT: WILL NOT notify
                        return ro;
                    }
                    // CASE 12: current minute for today
                    // RESULT: WILL NOTIFY
                    console.log("LONG REPEAT CURRENT MINUTE !!?? ", ro.reminder.time);
                } else if (is_past) {

                    // CASE 13: scheduled older than today
                    // we need to update the next reminder which should be in future
                    
                    var is_future_reminder_time = false,
                        future_reminder_time = new Date(ro.reminder.time);

                    // looping till we get a future reminder time
                    while (!is_future_reminder_time) {
                        // NOTE: we need to do this till we are in the future
                        // we will update the reminder time
                        future_reminder_time = moment( future_reminder_time )
                                                    .add( ro.reminder.repeat.time, ro.reminder.repeat.interval );

                        is_future_reminder_time = moment( future_reminder_time ).isAfter();
                    }
                    // updating reminder time with future reminder time
                    ro.reminder.time = future_reminder_time.format();

                    //RESULT: WILL NOT NOTIFY
                    return ro;
                } else {
                    // CASE 14: not past; not present; probably future for long repeat
                    console.log("LONG REPEAT FUTURE REMINDER");
                    // WILL NOT NOTIFY
                    return ro;
                }
            } else {
                // CASE 15: !!!
                // CAUTION: some UNKNOWN unique use case; do not proceed;
                // RESULT: WILL NOT NOTIFY
                return ro;
            }
        }

        // first pushing the remindoro in our list to notify later
        this.to_notify.push( ro );

        // returning the remindoro
        return ro;
    }

};
// END: Notification Module

// START: Helper Functions
// helper function to stript html tags
// ref: http://stackoverflow.com/a/822486/1410291
// note: this should return the string, if the incoming thing is a string and not html
export function strip_html( html ) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;

    return tmp.textContent || tmp.innerText || "";
}

// check if it is a valid url
export function isValidUrl (s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
}

// show a chrome notification
export function chrome_notify (details) {
    chrome.notifications.create( "" , {
        type: "basic",
        iconUrl: "/images/icon-38.png",
        title: details.title ? details.title : "",
        message: details.message ? details.message : "",
    }, function () {
        console.log("chrome notification show callback ", arguments);
    });
}

// check if chrome quota exceeded or similar runtime message
export function is_chrome_error () {
    // returns false if there is no chrome runtime error
    if (!chrome.runtime.lastError) {
        return false;
    }

    // there is an runtime error
    var chrome_error = ((chrome.runtime.lastError && chrome.runtime.lastError.message).indexOf("QUOTA_BYTES") >= 0);

    if (chrome_error) {
        chrome_error = chrome_error ? "storage" : "general";
    }

    console.log("CHROME ERROR ", chrome_error);

    // show chrome notification
    var error = {
        title: "",
        message: ""
    };

    if (chrome_error == "storage") {
        // storage error
        error.title = "Chrome Storage Limit Exceeded";
        error.message = "Please delete few reminders and try again.";
    } else {
        // some error not related to storage
        error.title = "Chrome Error";
        error.message = "Please try deleting few reminders and try again. If issue persists, please leave a feedback in Chrome Web Store";
    }

    chrome_notify({
        title: error.title,
        message: error.message
    });

    // return a string to indicate what is the error
    return chrome_error;
}

// for v0.1.6 
// BUGFIX: converting storage.sync to local due to storage space constraints
// if we detect there are some data in chrome.storage.sync, we will transfer it to chrome.storage.local
export function handle_sync_local_storage () {
    // first get data from chrome.storage.sync
    chrome.storage.sync.get("REMINDORO",  function (sync_data) {

        console.log("SYNC DATA! ", sync_data);

        if ( (_.isEmpty( sync_data )) ) {
            // if no sync data do not proceed 
            return;
        }
        console.log("MIGRATING SYNC TO LOCAL ", sync_data);
        // if sync data is present, let us try to merge those things with existing local data
        chrome.storage.local.get("REMINDORO", function (local_data) {
            // if local data is present will merge just the remindoros
            if ( !(_.isEmpty( local_data )) ) {
                
                let local_remindoros = (local_data["REMINDORO"] && local_data["REMINDORO"]["remindoros"]),
                    sync_remindoros = (sync_data["REMINDORO"] && sync_data["REMINDORO"]["remindoros"]);
                
                // merging local remindoros with sync remindoros
                // using lodash unionBy to merge with id property
                local_data["remindoros"] = _.unionBy( local_remindoros, sync_remindoros, "id" );
                // update the local storage
                chrome.storage.local.set({ "REMINDORO": local_data }, function () {
                    console.log("CHROME LOCAL DATA updated ", local_data);
                });
                // nullify the sync storage
                chrome.storage.sync.remove("REMINDORO", function () {
                    console.log("CHROME SYNC DATA nullified");
                });
            } else {
                // if no local data, just make sync data as local data
                // update the local storage
                chrome.storage.local.set({ "REMINDORO": sync_data["REMINDORO"] }, function () {
                    console.log("CHROME LOCAL DATA updated with sync data ", sync_data["REMINDORO"]);
                });
                // nullify the sync storage
                chrome.storage.sync.remove("REMINDORO", function () {
                    console.log("CHROME SYNC DATA nullified");
                });
            }
        });
    } );
}

// END: Helper Functions