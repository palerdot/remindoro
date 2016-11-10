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

    // checking reminder time for empty ro
    describe('Checking reminder time for empty ro', function() {
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

})();
