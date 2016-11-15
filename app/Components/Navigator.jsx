// top navigation bar containing the menu and close button
// menu is given as props along with icon names to display

import React from "react";
import classNames from "classnames"
import _ from "lodash";

import config from "json!../config.json";

// new es6 stateless functions which is an alternative for React.createClass
// the props are directly passed to this function by react
// ref: https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
// not a stateless componenet; we will keep track of id counter
// const Navigator = (props) => {
const Navigator = React.createClass({

    componentDidMount: function () {
        console.log("dispatching home screen");
        this.props.initializeHomeScreen();
    },

    getInitialState: function () {
        return {
            id_counter: this.props.id_counter
        }
    },

    render: function () {

        let props = this.props;

        return (
            <header className="row navigator valign-wrapper">

                <div className="col s12 valign no-padding">

                    <div className="col s6 left-align no-padding">
                        <button 
                            className="btn btn-floating waves-light waves-effect"
                            onClick={
                                () => {
                                    console.log("clicked the close button ", window);
                                    // closing the popup window
                                    window.close();
                                }
                            }
                        >
                            <i className="material-icons">close</i>    
                        </button>
                        <button 
                            className="btn btn-floating waves-light waves-effect"
                            onClick={
                                () => {
                                    // open the help file
                                    chrome.tabs.create({ url: config.help_url });
                                }
                            }
                        >
                            <i className="material-icons">help</i>
                        </button>
                        <button 
                            className="btn btn-floating waves-light waves-effect"
                        >
                            <i className="material-icons">star</i>
                        </button>
                    </div>
                    {/* displaying the menu items returned as props */}
                    <div className="col s6 right-align no-padding">
                        {
                            _.map( props.menu,  (value, key) => {

                                let nav_class = classNames("btn btn-floating waves-effect waves-light", {
                                    "current": props.current_tab == key
                                });

                                return (
                                    <button 
                                        className={nav_class}
                                        key={key}
                                        onClick={ 
                                            () => {
                                                let current_id = this.state.id_counter;
                                                // NOTE: not needed now since we are already adding when creating id
                                                // current_id++;
                                                // update the state
                                                this.setState({
                                                    id_counter: current_id
                                                });
                                                // before triggering the navigator click, checking if current clicked menu
                                                // is already a current tab
                                                if (key == "add") {
                                                    console.log("porumai! we will add a new remindoro ", current_id);
                                                    props.onAddClick( current_id );
                                                    // do not proceed;
                                                    return;
                                                }

                                                if (props.current_tab == key) {
                                                    console.log("same tab clicked ", props.current_tab);
                                                    // do not proceed
                                                    return;
                                                }
                                                // a different tab is clicked; proceed with state change
                                                props.onClick(key);   
                                            } 
                                        }
                                    >
                                        <i className="material-icons">{value}</i>
                                    </button>
                                );
                            } )
                        }
                    </div>

                </div>

            </header>
        );    
    }

});

export default Navigator;
