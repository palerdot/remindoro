// NOTE: wherever accessing "ro" property like "ro.reminder" always check for "ro" like "ro && ro.reminder"
// because initially there will be no selected remindoro

// simple bottom modal for showing scheduling options
import React from "react";
import classNames from "classnames";
import moment from "moment";

// import react-materialize because of materialize way of modifying dom
import { Input } from "react-materialize";
import { Throttle, Debounce } from "react-throttle";

// this is not a statelss component
const BottomModal = React.createClass({

    componentDidMount: function () {

        const flatpicker_config = {
            enableTime: true,
            wrap: true,
            minDate: "today",
            dateFormat: "d - M - Y, h:i K",
            // the default date is the reminder time previously saved if present or null
            // defaultDate: this.state.reminder_time,

            onReady: function(dateObj, dateStr, instance) {
                $(instance.amPM).click( function () {
                    // HACK: AM/PM does not respond to onChange Event
                    // triggering change manually on AM/PM click
                    instance.triggerChange();
                } );
            },

            // using arrow functions to dynamically bind this to BottomModal
            onChange: (dateObj, dateStr, instance) => {
                const current_ro = this.props.current_selected_remindoro;
                const ro = current_ro ? this.props.remindoros.find( (ro) => (ro.id == this.props.current_selected_remindoro) ) : {};

                let date_string = dateObj.length > 0 ? dateObj[0].toString() : "";
                console.log("on change ", date_string);

                // HACK: onUpdate is not triggered on AM/PM change. we are doing an additional check that flatpickr is open
                // trigger the reminder change action
                // IMPORTANT: this will be triggered at all times; 
                // we have an additional check to update if only current selected remindoro is present and it has the reminder switched on
                if (instance && instance.isOpen && ro && ro.id) {
                    this.props.onReminderTimeChange( ro && ro.id, ro && ro.reminder && ro.reminder.time, date_string );    
                }
            },

            // NOTE: careful this is triggered when a value is set and when AM/PM button is toggled
            // this will lead to a vicious cycle of react updates and chrome storage updates
            onValueUpdate: (dateObj, dateStr, instance) => {
            },

            onOpen: function(dateObj, dateStr, instance) {
                console.log("on open ", dateObj[0], arguments);
            },

            onClose: function(dateObj, dateStr, instance){

            }
        };

        const current_ro = this.props.current_selected_remindoro;
        const ro = current_ro ? this.props.remindoros.find( (ro) => (ro.id == this.props.current_selected_remindoro) ) : {};

        this.flatpickr = flatpickr(".flatpickr", flatpicker_config);

        // set time in the flatpickr once componenet is updated
        this.flatpickr.setDate( ro && ro.reminder && ro.reminder.time );

    },

    componentDidUpdate: function() {
        console.log("updating bottom modal component");
        // called after render is done when data changes
        // update the material select box !!!!
        $("select").material_select();

        const current_ro = this.props.current_selected_remindoro;

        // get the current ro if some ro is selected
        const ro = current_ro ? this.props.remindoros.find( (ro) => (ro.id == this.props.current_selected_remindoro) ) : {};

        // set time in the flatpickr once componenet is updated
        this.flatpickr.setDate( ro && ro.reminder && ro.reminder.time );

    },

    render: function () {

        // get a handle on the current selected remindoro
        const ro = this.props.remindoros.find( (ro) => (ro.id == this.props.current_selected_remindoro) );
        const current_ro = this.props.current_selected_remindoro;
        console.log("rendering bottom modal ", ro, (ro && ro.reminder.is_repeat));

        const debounced_repeat_update = _.debounce( () => {
            this.props.onRepeatChange( this.props.current_selected_remindoro, true );
        }, 250 );

        // construct the classnames for disabled/active state
        const reminder_button_class = classNames("btn btn-floating transparent input-button", {
            "disabled": !(ro && ro.reminder && ro.reminder.time),
            "waves-effect waves-light": (ro && ro.reminder && ro.reminder.time)
        });

        return (
            <div id="options-modal" className="modal bottom-sheet">
                <div className="modal-content">

                    <div className="row">
                        <label>
                            <i className="material-icons">notifications</i>
                            <span>Reminder</span>
                        </label>

                        <div className="form-group">

                            <div className="row no-margin-vert">
                                <div className="col s4 valign-wrapper">
                                    <div className="switch">
                                        <label>
                                            Off
                                            <input 
                                                id="reminder-time-status" 
                                                type="checkbox"
                                                checked={(ro && ro.reminder && ro.reminder.time) ? "checked": ""}
                                                onChange={ (event) => {

                                                    let default_r_time = null;
                                                    
                                                    // update the reminder time
                                                    if (event.target.checked) {
                                                        // set default time as 45 minutes from now
                                                        default_r_time = moment().add(45, "minutes").format();
                                                    }

                                                    console.log("reminder change ", default_r_time);

                                                    this.flatpickr.setDate( default_r_time );

                                                    // calling the reminderchange module to update the status
                                                    // we are also sending the current reminder time
                                                    this.props.onReminderStatusChange( this.props.current_selected_remindoro, event.target.checked, default_r_time );

                                                } } 
                                            />
                                            <span className="lever"></span>
                                            On
                                        </label>
                                    </div>
                                </div>
                                <div className="col s8">
                                    <div className="reminder-time-flatpickr flatpickr" data-wrap="true">
                                        <input
                                            type="text" 
                                            id="reminder-time"
                                            className="col s10"
                                            placeholder="Reminder time .."
                                            data-input data-open 
                                            disabled={(ro && ro.reminder && ro.reminder.time) ? "": "disabled"}
                                        />
                                        <div className="col s2">
                                            <button className={reminder_button_class} data-toggle>
                                                <i className="material-icons">event</i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="row no-margin-vert">
                        <label>
                            <i className="material-icons">update</i>
                            <span>Repeat</span>
                        </label>
                        <div className="form-group">

                            <div className="row no-margin-vert">
                                <div className="col s4 valign-wrapper">
                                    <div className="switch">
                                        <label>
                                            Off
                                            <input 
                                                type="checkbox"
                                                checked={(ro && ro.reminder && ro.reminder.is_repeat) ? "checked": ""}
                                                onChange={ (event) => {
                                                    // calling the repeat change module to update the status
                                                    this.props.onRepeatChange( this.props.current_selected_remindoro, event.target.checked );
                                                } } 
                                            />
                                            <span className="lever"></span>
                                            On
                                        </label>
                                    </div>
                                </div>
                                <div className="col s8">
                                    <div className="col s3 valign-wrapper">
                                        <span className={(ro && ro.reminder.is_repeat) ? "valign" : "valign disabled"}>Every</span>
                                        <span className="repeat-time-info"> { (ro && ro.reminder && ro.reminder.is_repeat) ? ro.reminder.repeat.time : ""} </span>
                                    </div>
                                    <div className="col s5">
                                        <div className="range-field">
                                            {/*<Debounce time="750" handler="onChange">
                                                <input 
                                                    type="range" 
                                                    id="repeat-time" 
                                                    min="1" max="60"
                                                    disabled={ (ro && ro.reminder.is_repeat) }
                                                    onChange={ (event) => {
                                                        // we are just setting true for repeat. value will be taken in App.jsx
                                                        this.props.onRepeatChange( this.props.current_selected_remindoro, true );
                                                    } } 
                                                />
                                            </Debounce>*/}
                                            <input 
                                                type="range" 
                                                id="repeat-time" 
                                                min="1" max="60"
                                                defaultValue={ (ro && ro.reminder && ro.reminder.repeat.time) ? ro.reminder.repeat.time : "5" }
                                                disabled={ (ro && ro.reminder && ro.reminder.is_repeat) ? "" : "disabled" }
                                                onChange={ (event) => {
                                                    // we are just setting true for repeat. value will be taken in App.jsx
                                                    // this.props.onRepeatChange( this.props.current_selected_remindoro, true );
                                                    debounced_repeat_update();
                                                } } 
                                            />
                                        </div>
                                    </div>
                                    <div className="col s4 no-margin-vert child-no-margin-vert">
                                        <Input
                                            type='select'
                                            id="repeat-interval"
                                            defaultValue={ (ro && ro.reminder && ro.reminder.repeat.interval) ? ro.reminder.repeat.interval : "minutes" }  
                                            disabled={ (ro && ro.reminder && ro.reminder.is_repeat) ? "" : "disabled" }
                                            onChange={ (event) => {
                                                // we are just setting true for repeat. value will be taken in App.jsx
                                                this.props.onRepeatChange( this.props.current_selected_remindoro, true );
                                            } }
                                        >
                                            <option value="minutes">Minute(s)</option>
                                            <option value="hours">Hour(s)</option>
                                            <option value="days">Day(s)</option>
                                            <option value="months">Month(s)</option>
                                        </Input>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                <div className="modal-footer">
                    <button className="modal-action modal-close waves-light waves-effect btn blue-grey darken-2 right">
                        Close
                    </button>
                    <button 
                        className="waves-effect waves-light btn red left"
                        onClick={ () => { this.props.onDelete(ro.id); } }
                    >
                        <i className="material-icons left">delete_forever</i>Delete
                    </button>
                </div>
            </div>

        );
    }

});

export default BottomModal;