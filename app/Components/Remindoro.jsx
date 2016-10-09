// main remindoro componenet that displays the remindoro in home, notifications ... tabs
// with appropriate filters

import React from "react";
import classNames from "classnames";
import ContentEditable from "react-contenteditable";
import { Throttle, Debounce } from "react-throttle";
import _ from "underscore";

// props is sent as an argument
const Remindoro = (props) => {

    console.log("props for remindoro ? ", props);

    return (
        <div id="remindoros" className="col s12">
           {
                props.remindoros.map( (ro) => {
                    return (
                        <div className="remindoro row">
                            <div className="remindoro-header col s12">
                                <div className="col s11 no-padding">
                                    <Debounce time="750" handler="onChange">
                                        <ContentEditable
                                            html={ro.id}
                                            onChange={ props.onTitleChange }
                                        />
                                    </Debounce>
                                </div>
                                <div className="col s1 right-align">
                                    <i className="material-icons">close</i>
                                </div>
                            </div>
                            <div className="remindoro-content col s12">
                                <div contentEditable className="note">
                                    {ro.title}
                                </div>
                                <div>{ro.type}</div>
                            </div>
                            <div className="remindoro-footer col s12">

                            </div>
                        </div>
                    );
                } )
           }
        </div>
    )

};

export default Remindoro;