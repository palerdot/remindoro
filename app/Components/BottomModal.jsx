// simple bottom modal for showing scheduling options
import React from "react";
import classNames from "classnames";
import _ from "underscore";

// this is not a statelss component
const BottomModal = React.createClass({

    componentDidMount: function () {
        console.log("Porumai! bottom modal mounted ", $("#options-modal") );
        const flatpicker_config = {
            enableTime: true,
            wrap: true,
            minDate: "today"
        };

        flatpickr(".flatpickr", flatpicker_config);
    },

    render: function () {
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
                                            <input type="checkbox" />
                                            <span className="lever"></span>
                                            On
                                        </label>
                                    </div>
                                </div>
                                <div className="col s8">
                                    <div className="flatpickr" data-wrap="true">
                                        <input id="reminder-time" className="col s10" placeholder="Pick a time for reminder .." data-input data-open />
                                        <div className="col s2">
                                            <button className="btn btn-floating waves-effect waves-light transparent input-button" data-toggle>
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
                                            <input type="checkbox" />
                                            <span className="lever"></span>
                                            On
                                        </label>
                                    </div>
                                </div>
                                <div className="col s8">
                                    <div className="flatpickr" data-wrap="true">
                                        <input id="repeat-time" className="col s10" placeholder="Pick a time for reminder .." data-input data-open />
                                        <div className="col s2">
                                            <button className="btn btn-floating waves-effect waves-light transparent input-button" data-toggle>
                                                <i className="material-icons">event</i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
    }

});

export default BottomModal;