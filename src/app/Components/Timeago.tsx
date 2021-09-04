import React, { PureComponent } from 'react'
import dayjs from 'dayjs'

/*
 * Timeago
 *
 * our own timeago component using dayjs relative time
 * ref: https://day.js.org/docs/en/plugin/relative-time
 *
 * dayjs already has relative time manipulation
 * we don't want to import another package when we could implement
 * live update ourselves
 *
 */

/*
 * Live update intervals (for both +ve and -ve offsets from 'now')
 * https://day.js.org/docs/en/display/from-now#list-of-breakdown-range
 *
 * < 90s (1.5m) => Every 32 seconds (because dayjs will show 'a few seconds')
 * < 90m => Every minute
 * < 5h => Every 15 mins
 * > 5h =< Every 32 mins
 *
 */
function liveUpdateInterval(timestamp: number) {
  // we will get a diff (past or future does not matter)
  const diff = Math.abs(dayjs(timestamp).diff(dayjs(Date.now())))

  // better time units
  const SECONDS = 1000 // base unit
  const MINUTES = 60 * SECONDS
  const HOURS = 60 * MINUTES

  // < 90s
  if (diff < 90 * SECONDS) {
    // 32 seconds
    return 32 * SECONDS
  }

  // < 90m
  if (diff < 90 * MINUTES) {
    // 1 minute
    return 1 * MINUTES
  }

  // < 5h
  if (diff < 5 * HOURS) {
    // 15 minutes
    return 15 * MINUTES
  }

  // default 32 minutes
  return 32 * MINUTES
}

type Props = {
  timestamp: number
}

type State = {
  liveText: string
}

type Maybe<T> = T | undefined

class Timeago extends PureComponent<Props, State> {
  timerId: Maybe<number>
  updateInterval: number

  state: State = {
    liveText: this.getLiveText(),
  }

  getLiveText() {
    const { timestamp } = this.props
    // calculate initial text
    const diff = timestamp - Date.now()
    const isPast = diff < 0

    const liveText = isPast
      ? // 'now' -> to -> past
        dayjs().to(dayjs(timestamp))
      : // 'future' -> from -> now
        dayjs(timestamp).from(dayjs())

    return liveText
  }

  constructor(props: Props) {
    super(props)

    const { timestamp } = props
    this.updateInterval = liveUpdateInterval(timestamp)
  }

  // helper functions
  updateText() {
    const { timestamp } = this.props

    // IMPORTANT:
    // before proceeding to updating the text
    // we have to check if we need a new update interval
    const newUpdateInterval = liveUpdateInterval(timestamp)

    // this particular check prevents infinite loop
    if (newUpdateInterval !== this.updateInterval) {
      this.resetTimer()
      // do not proceed to update the text
      return
    }

    // update state
    this.setState({
      liveText: this.getLiveText(),
    })
  }

  // resets timer
  // calculates new live update interval from current time
  // and sets up the new timer with updated time interval
  // it helps in two cases
  // 1 - when timestamp has changed
  // 2 - before updating live text, we realise timer interval needs to be changed
  resetTimer() {
    // update new interval
    this.updateInterval = liveUpdateInterval(this.props.timestamp)

    // set up new timer
    this.setupTimer()
  }

  // sets up the live updating timer
  setupTimer() {
    // always clear existing timer
    this.clearTimer()

    // setup live update timer
    this.timerId = window.setInterval(() => {
      this.updateText()
    }, this.updateInterval)
  }

  // clears the live updating timer
  clearTimer() {
    window.clearInterval(this.timerId)
  }

  componentDidMount() {
    this.setupTimer()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.timestamp !== this.props.timestamp) {
      // we need to reset the timer
      this.resetTimer()
      // also update state
      this.setState({
        liveText: this.getLiveText(),
      })
    }
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  render() {
    const datetime = new Date(this.props.timestamp).toDateString()

    return (
      <div className={'time-ago'}>
        <time dateTime={datetime}>{this.state.liveText}</time>
      </div>
    )
  }
}

export default Timeago
