import { calculate_remindoro_id, Notification } from "../../app/js/utils.js";
import moment from "moment";
import _ from "lodash";

(function() {
    'use strict';

    var assert = require("assert");

    describe('Porumai!', function() {
        describe('we will slowly start testing', function() {
            it('Porumai! should be equal Porumai', function() {
                assert.equal("Porumai", "Porumai");
            });
        });
    });

    // calculating remindoro ids for empty remindoro array
    describe('Checking Remindoro id counter for empty remindoro array', function() {
        it('should return 1', function() {
            var ros = [];
            var ro_id = calculate_remindoro_id( ros );
            assert.equal(ro_id, 1);
        });
    });

    // calculating remindoro ids for remindoro array
    describe('Checking Remindoro id counter', function() {
        it('should return 17', function() {
            var ros = [{
                id: 16
            }];
            var ro_id = calculate_remindoro_id( ros );
            assert.equal(ro_id, 17);
        });
    });

    // CASE 1: checking reminder time for empty ro
    describe('CASE 1: No reminder set', function() {
        it('should return the same object', function() {

            var check = Notification.check;

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    time: null, // if null no alarm set,
                    is_repeat: false,
                    repeat: {
                        interval: "months",
                        time: 1
                    }
                } 
            };

            assert.equal( ro, check(ro) );
        });
    });

    // CASE 3: NON REPEATABLE => if remindoro is in future should return the same ro
    describe('CASE 3: NON REPEATABLE  => Reminder time is in future', function() {
        it('should return the same object', function() {

            // clear the to notify queue
            Notification.to_notify = [];

            var check = Notification.check;

            // reminder time is in future
            var future_reminder_time = moment().add("7", "days");

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    // reminder time is in future
                    time: future_reminder_time,
                    is_repeat: false,
                    repeat: {
                        interval: "months",
                        time: 1
                    }
                } 
            };
            assert.equal( ro, check(ro) );
            assert.equal( ro.reminder.time, future_reminder_time );
            // assert.equal( [], Notification.to_notify );
            // ref: http://stackoverflow.com/questions/13225274/the-difference-between-assert-equal-and-assert-deepequal-in-javascript-testing-w
            assert.deepEqual( [], Notification.to_notify );

        });
    });

    // CASE 4: NON REPEATABLE => if remindoro is more than 15 mins old; return the ro by invalidating the reminder time 
    describe('CASE 4: NON REPEATABLE  => Reminder time is more than 15 mins old', function() {

        beforeEach( () => {
            // clear the to notify queue
            Notification.to_notify = [];
        } );

        it('should return the same object and reminder time should be false', function() {

            // reminder time more than 15 mins old
            var very_old_reminder_time = moment().subtract("1", "days");

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    // reminder time is more than 15 mins old
                    time: very_old_reminder_time,
                    is_repeat: false,
                    repeat: {
                        interval: "months",
                        time: 1
                    }
                } 
            };
            
            assert.equal( ro, Notification.check(ro) );
            assert.equal( false, Notification.check(ro).reminder.time );
            assert.notEqual( Notification.check(ro).reminder.time, very_old_reminder_time );
            // assert.equal( ro.reminder.time, future_reminder_time );
            // assert.equal( [], Notification.to_notify );
            // ref: http://stackoverflow.com/questions/13225274/the-difference-between-assert-equal-and-assert-deepequal-in-javascript-testing-w
            // assert.deepEqual( [], Notification.to_notify );
        });

        it("notification queue should be empty", function () {

            // reminder time more than 15 mins old
            var very_old_reminder_time = moment().subtract("1", "day");

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    // reminder time is more than 15 mins old
                    time: very_old_reminder_time,
                    is_repeat: false,
                    repeat: {
                        interval: "months",
                        time: 1
                    }
                } 
            };
            
            // assert.equal( ro, check(ro) );
            // assert.equal( ro.reminder.time, future_reminder_time );
            // assert.equal( [], Notification.to_notify );
            // ref: http://stackoverflow.com/questions/13225274/the-difference-between-assert-equal-and-assert-deepequal-in-javascript-testing-w
            assert.deepEqual( [], Notification.to_notify );

        });

    });

    // CASE 5: NON REPEATABLE => if remindoro is atmost 15 mins old; will notify remindoro
    describe('CASE 5: NON REPEATABLE  => Reminder time atmost 15 mins old', function() {

        beforeEach( () => {
            // clear the to notify queue
            Notification.to_notify = [];
        } );

        it('should NOTIFY; queue should have one value', function() {

            // reminder time more than 15 mins old
            var very_recent_reminder_time = moment().subtract("1", "minutes");

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    // reminder time is more than 15 mins old
                    time: very_recent_reminder_time,
                    is_repeat: false,
                    repeat: {
                        interval: "months",
                        time: 1
                    }
                } 
            };

            assert.equal( ro, Notification.check(ro) );
            // will notify
            assert.equal( Notification.to_notify.length, 1 );
            // and clearing the reminder time
            assert.equal( false, Notification.check(ro).reminder.time );
            
        });

    });

    // CASE 7, 8, 9: REPEATABLE => SHORT REPEAT
    describe('REPEATABLE => SHORT REPEAT', function() {

        beforeEach( () => {
            // clear the to notify queue
            Notification.to_notify = [];
        } );

        it('CASE 7: EXACT MINUTE => should NOTIFY => queue should have one value; updating reminder time for next iteration', function() {

            var current_minute_time = moment();

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    // reminder time is more than 15 mins old
                    time: current_minute_time,
                    is_repeat: true,
                    repeat: {
                        interval: "minutes",
                        time: 45
                    }
                } 
            };

            var next_reminder_time = moment( new Date(ro.reminder.time) )
                                            .add( ro.reminder.repeat.time, ro.reminder.repeat.interval )
                                            .format();

            var checked_ro = Notification.check(ro);

            assert.equal( ro, checked_ro );
            // will notify
            assert.equal( Notification.to_notify.length, 1 );
            // and updating next reminder time
            assert.equal( next_reminder_time, checked_ro.reminder.time );
            
        });

        it('CASE 8: PAST => should NOT NOTIFY => queue should empty; updating to next iteratin', function() {

            var past_time = moment().subtract("30", "minutes");

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    time: past_time,
                    is_repeat: true,
                    repeat: {
                        interval: "minutes",
                        time: 45
                    }
                } 
            };

            var next_reminder_time = moment()
                                            .add( ro.reminder.repeat.time, ro.reminder.repeat.interval )
                                            .format();

            var checked_ro = Notification.check(ro);

            assert.equal( ro, checked_ro );
            // will not notify
            assert.equal( Notification.to_notify.length, 0 );
            // and updating next reminder time
            assert.equal( next_reminder_time, checked_ro.reminder.time );
            
        });

        it('CASE 9: FUTURE => should NOT NOTIFY => queue should be empty', function() {

            var future_time = moment().add("30", "minutes");

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    time: future_time,
                    is_repeat: true,
                    repeat: {
                        interval: "minutes",
                        time: 45
                    }
                } 
            };

            var checked_ro = Notification.check(ro);

            assert.equal( ro, checked_ro );
            // will not notify
            assert.equal( Notification.to_notify.length, 0 );
            // and reminder time should stay same
            assert.equal( ro.reminder.time, checked_ro.reminder.time );
            
        });

    });

    // LONG REPEAT
    describe('REPEATABLE => LONG REPEAT', function() {

        beforeEach( () => {
            // clear the to notify queue
            Notification.to_notify = [];
        } );

        it("CASE 11: TODAY => not current minute (past) => WILL NOT NOTIFY", function () {

            var today_past_current_minute = moment().subtract("30", "minutes");

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    time: today_past_current_minute,
                    is_repeat: true,
                    repeat: {
                        interval: "minutes",
                        time: 45
                    }
                } 
            };

            var checked_ro = Notification.check(ro);

            assert.equal( ro, checked_ro );
            // will not notify
            assert.equal( Notification.to_notify.length, 0 );
            // and reminder time should stay same
            assert.equal( ro.reminder.time, checked_ro.reminder.time );

        });

        it("CASE 12: TODAY => current minute => WILL NOTIFY => update next iteration", function () {

            var current_minute = moment();

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    time: current_minute,
                    is_repeat: true,
                    repeat: {
                        interval: "minutes",
                        time: 45
                    }
                } 
            };

            var checked_ro = Notification.check(ro);

            assert.equal( ro, checked_ro );
            // will not notify
            assert.equal( Notification.to_notify.length, 1 );
            // and reminder time should stay same (we will update after today is past)
            assert.equal( ro.reminder.time, checked_ro.reminder.time );

        });

        it("CASE 13: PAST OF TODAY => WILL NOT NOTIFY", function () {

            var yesterday = moment().subtract("3", "days");

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    time: yesterday,
                    is_repeat: true,
                    repeat: {
                        interval: "days",
                        time: 2
                    }
                } 
            };

            var checked_ro = Notification.check(ro);

            assert.equal( ro, checked_ro );
            // will not notify
            assert.equal( Notification.to_notify.length, 0 );

        });

        it("CASE 13: PAST OF TODAY => next iteration 1 days from now", function () {

            var yesterday = moment().subtract("3", "days");

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    time: yesterday,
                    is_repeat: true,
                    repeat: {
                        interval: "days",
                        time: 2
                    }
                } 
            };

            var checked_ro = Notification.check(ro);

            var next_reminder = moment( moment().startOf( "day" ) )
                                    .add( "1", "days" );

            assert.equal( ro, checked_ro );
            // will not notify
            assert.equal( next_reminder.format(), moment( checked_ro.reminder.time ).startOf( "day" ).format() );

        });

        it("CASE 14: FUTURE OF TODAY => WILL NOT NOTIFY", function () {

            var future = moment().add("3", "days");

            var ro = {
                id: 17,
                type: "list/note",
                note: "", // if note contains the string here
                list: [

                ], // if list contains the list details
                created: "",
                updated: "",
                reminder: {
                    time: future,
                    is_repeat: true,
                    repeat: {
                        interval: "days",
                        time: 2
                    }
                } 
            };

            var checked_ro = Notification.check(ro);

            assert.equal( ro, checked_ro );
            // will not notify
            assert.equal( Notification.to_notify.length, 0 );

        });

    });

})();
