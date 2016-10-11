// simple bottom modal for showing scheduling options
import React from "react";
import classNames from "classnames";
import _ from "underscore";

const BottomModal = () => {

    return (
        <div id="options-modal" className="modal bottom-sheet">
            <div className="modal-content">
                <h4>Modal Header</h4>
                <p>A bunch of text</p>
            </div>
            <div className="modal-footer row">
                <button className="modal-action modal-close waves-light waves-effect btn transparent right">Close</button>
                <button className="waves-effect waves-light btn red left">
                    <i className="material-icons left">delete_forever</i>Delete
                </button>
            </div>
        </div>

    );

};

export default BottomModal;