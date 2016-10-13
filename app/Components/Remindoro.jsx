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
        <div id="remindoros" className="col s12 no-padding-hori">
           {
                props.remindoros.map( (ro) => {
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
                                                    html={ro.title}
                                                    placeholder={"Add a Note ..."}
                                                    onChange={ (evt) => props.onNoteChange( ro.id, evt.target.value ) }
                                                />
                                            </Debounce>
                                        </div>
                                    </div>
                                    <div className="card-action row remindoro-footer">
                                        <div className="col s11">
                                            
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