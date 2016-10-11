// simple bottom modal for showing scheduling options
import React from "react";
import classNames from "classnames";
import _ from "underscore";

const BottomModal = () => {

    return (
        <div id="options-modal" className="modal bottom-sheet">
            <div className="modal-content">

                <div className="row">
                    <label>
                        <i className="material-icons">notifications</i>
                        <span>Reminder</span>
                    </label>
                    <div className="form-group">
                        something here?
                    </div>
                </div>

                <div className="row">
                    <label>
                        <i className="material-icons">alarm</i>
                        <span>Repeat</span>
                    </label>
                    <div className="form-group">
                        something here?
                    </div>
                </div>

                <div className="row">
                    <div className="col s4 input-field">
                        <i className="material-icons prefix">notifications_active</i>
                        <label>
                            Reminder
                        </label>
                    </div>
                    <div className="col s8 input-field">
                        <div className="switch">
                            <label>
                                Off
                                <input type="checkbox" />
                                <span className="lever"></span>
                                On
                            </label>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s4">
                        <label>Reminder Time:</label>
                    </div>
                    <div className="input-field col s8">
                        <input id="reminder_time" type="text" className="validate" />
                        <label htmlFor="reminder_time">Reminder Time</label>
                    </div>
                </div>

            </div>
            <div className="modal-footer">
                <button className="modal-action modal-close waves-light waves-effect btn grey darken-2 right">Close</button>
                <button className="waves-effect waves-light btn red left">
                    <i className="material-icons left">delete_forever</i>Delete
                </button>
            </div>
        </div>

    );

};

export default BottomModal;