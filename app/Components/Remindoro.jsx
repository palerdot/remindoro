// main remindoro componenet that displays the remindoro in home, notifications ... tabs
// with appropriate filters

import React from "react";
import TimeAgo from "react-timeago";
import classNames from "classnames";
import ContentEditable from "react-contenteditable";
import { Throttle, Debounce } from "react-throttle";

// props is sent as an argument
const Remindoro = (props) => {

    console.log("props for remindoro ? ", props);

    return (
        <div id="remindoros" className="col s12 no-padding-hori">
           {
                props.remindoros.map( (ro) => {

                    // decide if we have show a timeago element
                    // if the remindoro is less than 15 minutes in future; we will display the timeago element
                    const timeago_interval = 15 * 60 * 1000; // 15 minutes in milliseconds
                    let TimeAgo_Component = "";

                    if (ro.reminder.time) {
                        // let us decide if we want to display the human readable time alert
                        const ro_timestamp = new Date( ro.reminder.time ).getTime(),
                              current_timestamp = new Date().getTime(),
                              time_difference = (ro_timestamp - current_timestamp);
                        
                        // for now checking if the remindoro is in future
                        // const is_ro_active = (time_difference > 0) && (time_difference <= timeago_interval);
                        const is_ro_active = (time_difference > 0);

                        if (is_ro_active) {
                            TimeAgo_Component = <div className="card green darken-1 row valign-wrapper no-margin-vert">
                                                    <div className="col s2">
                                                        <i className="material-icons">alarm</i>
                                                    </div>
                                                    <div className="col s10">
                                                        <TimeAgo 
                                                            date={ro.reminder.time} 
                                                        />
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
                                            <Debounce time="750" handler="onChange">
                                                <ContentEditable
                                                    html={ro.title}
                                                    placeholder={"Title .."}
                                                    onChange={ (evt) => props.onTitleChange( ro.id, evt.target.value ) }
                                                />
                                            </Debounce>
                                        </span>
                                        <div className="remindoro-content flow-text">
                                            <Debounce time="750" handler="onChange">
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
        </div>
    )

};

export default Remindoro;