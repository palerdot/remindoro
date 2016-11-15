// main remindoro componenet that displays the remindoro in home, notifications ... tabs
// with appropriate filters

import React from "react";
import TimeAgo from "react-timeago";
import classNames from "classnames";
import ContentEditable from "react-contenteditable";
import { Throttle, Debounce } from "react-throttle";
import moment from "moment";

import _ from "lodash";

// props is sent as an argument
// const Remindoro = (props) => {
const Remindoro = React.createClass({

    componentDidMount: function () {
        console.log("remindoro component mounted");
    },

    componentDidUpdate: function () {
        console.log("remindoro component updated");
    },

    render: function () {

        let props = this.props;

        let empty_remindoro_component = "";

        if (props.remindoros.length == 0) {
            console.log("empty remindoros ", props);
            let empty_msg = "",
                is_event_tab = (props.current_tab == "events");

            if (is_event_tab) {
                empty_msg = "No Scheduled Remindoros!"
            } else {
                empty_msg = "Empty!"
            }

            empty_remindoro_component = <div className="center">
                                            {empty_msg}
                                        </div>;    
        }

        

        return (
            <div id="remindoros" className="col s12 no-padding-hori">
               {
                    props.remindoros.map( (ro) => {

                        // decide if we have show a timeago element

                        let TimeAgo_Component = "",
                            Repeat_Component = "";

                        // if we have a reminder time scheduled
                        if (ro.reminder.time) {
                            // let us decide if we want to display the human readable time alert
                            const ro_timestamp = new Date( ro.reminder.time ).getTime(),
                                  current_timestamp = new Date().getTime(),
                                  // buffer time 1 minutes. i.e we will notify if the remindoro is atmost 1 minute(s) old
                                  buffer = 1 * 60 * 1000,
                                  time_difference = (ro_timestamp - current_timestamp);
                            
                            // for now checking if the remindoro is in future or just 1 minute in past
                            // const is_ro_active = (time_difference > 0) && (time_difference <= timeago_interval);
                            // const is_ro_active = (time_difference > 0);
                            let is_ro_active = (time_difference >= -buffer); // just 1 minute in past

                            // note in case of long repeat => days, months we need to show the reminder for the current day
                            const is_short_repeat = _.indexOf(["minutes", "hours"], ro.reminder.repeat.interval) > -1,
                                  is_long_repeat = _.indexOf(["days", "months"], ro.reminder.repeat.interval) > -1;

                            let is_today = false; // for long repeat this is use to show "Today" info

                            if (is_long_repeat) {
                                // actively we need to show if it is today
                                is_today = moment().isSame( ro.reminder.time, "day" );
                                // if today we will show the alert
                                is_ro_active = is_today ? true : false;
                            }

                            if (is_ro_active) {
                                TimeAgo_Component = <div className="card green darken-1 row valign-wrapper no-margin-vert">
                                                        <div className="col s2">
                                                            <i className="material-icons">alarm</i>
                                                        </div>
                                                        <div className="col s10">
                                                            { is_today ? "Today " : "" }
                                                            <TimeAgo 
                                                                date={ro.reminder.time} 
                                                            />
                                                        </div>
                                                    </div>;
                            }

                            if (ro.reminder.is_repeat) {
                                Repeat_Component = <div className="card transparent deep-orange darken-1 center white-text row valign-wrapper no-margin-vert">
                                                        <div className="col s12">
                                                            <i className="material-icons">repeat</i>
                                                        </div>
                                                    </div>;
                            }
                                                    
                        }

                        return (
                            <div id={'remindoro-' + ro.id} className="remindoro row no-margin-vert" key={ro.id}>
                                <div className="col s12">
                                    <div className="card blue-grey darken-3">
                                        <div className="card-content white-text">
                                            <span className="card-title remindoro-title">
                                                <Debounce time="250" handler="onChange">
                                                    <ContentEditable
                                                        html={ro.title}
                                                        placeholder={"Title .."}
                                                        onChange={ (evt) => props.onTitleChange( ro.id, evt.target.value ) }
                                                    />
                                                </Debounce>
                                            </span>
                                            <div className="remindoro-content flow-text">
                                                <Debounce time="250" handler="onChange">
                                                    <ContentEditable
                                                        html={ro.note}
                                                        placeholder={"Add a Note ..."}
                                                        onChange={ (evt) => props.onNoteChange( ro.id, evt.target.value ) }
                                                    />
                                                </Debounce>
                                            </div>
                                        </div>
                                        <div className="card-action row remindoro-footer valign-wrapper">
                                            <div className="col s11">
                                                <div className="col s6 left">
                                                    {TimeAgo_Component}
                                                </div>
                                                <div className="col s2">
                                                    {Repeat_Component}
                                                </div>
                                            </div>
                                            <div className="col s1 no-padding">
                                                <a 
                                                    className="btn-floating waves-effect transparent"
                                                    onClick={ (evt) =>{
                                                        // send the id of the remindoro for which menu is clicked
                                                        props.onMenuClick(ro.id);   
                                                    } }
                                                >
                                                    <i className="material-icons">more_vert</i>
                                                </a>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    } )
               }
               {empty_remindoro_component}
            </div>
        );
    }

});

export default Remindoro;