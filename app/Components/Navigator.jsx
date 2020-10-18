// top navigation bar containing the menu and close button
// menu is given as props along with icon names to display

import React from 'react'
import classNames from 'classnames'
import { map as _map } from 'lodash'

import config from '../config.json'

class Navigator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id_counter: props.id_counter,
    }
  }

  componentDidMount() {
    this.props.initializeHomeScreen()
  }

  displayName = 'Navigator'

  render() {
    const { props } = this

    return (
      <header className="row navigator valign-wrapper">
        <div className="col s12 valign">
          <div className="col s6 left-align no-padding">
            <button
              className="btn btn-floating waves-light waves-effect"
              onClick={() => {
                // closing the popup window
                window.close()
              }}
            >
              <i className="material-icons">close</i>
            </button>
            <button
              className="btn btn-floating waves-light waves-effect"
              onClick={() => {
                // open the help file
                chrome.tabs.create({
                  url: config[process.env.TARGET_PLATFORM].help_url,
                })
              }}
            >
              <i className="material-icons">help</i>
            </button>
            <button
              className="btn btn-floating waves-light waves-effect"
              onClick={() => {
                // open the help file
                chrome.tabs.create({
                  url: config[process.env.TARGET_PLATFORM].rate_url,
                })
              }}
            >
              <i className="material-icons">star</i>
            </button>
          </div>
          {/* displaying the menu items returned as props */}
          <div className="col s6 right-align no-padding">
            {_map(props.menu, (value, key) => {
              let nav_class = classNames(
                'btn btn-floating waves-effect waves-light',
                {
                  current: props.current_tab == key,
                }
              )

              return (
                <button
                  className={nav_class}
                  key={key}
                  onClick={() => {
                    let current_id = this.state.id_counter
                    // NOTE: not needed now since we are already adding when creating id
                    // current_id++;
                    // update the state
                    this.setState({
                      id_counter: current_id,
                    })
                    // before triggering the navigator click, checking if current clicked menu
                    // is already a current tab
                    if (key == 'add') {
                      props.onAddClick(current_id)
                      // do not proceed;
                      return
                    }

                    if (props.current_tab == key) {
                      // do not proceed
                      return
                    }
                    // a different tab is clicked; proceed with state change
                    props.onClick(key)
                  }}
                >
                  <i className="material-icons">{value}</i>
                </button>
              )
            })}
          </div>
        </div>
      </header>
    )
  }
}

export default Navigator
