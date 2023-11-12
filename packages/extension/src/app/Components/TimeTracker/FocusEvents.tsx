import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { isEmpty } from '@lodash'

import { FocusEvent } from '@background/time-tracker/web-session'
import { formattedWebSessionDuration } from '@app/Util'

type Props = {
  stringified: string
}

const Holder = styled.div`
  border: ${props => `thin solid ${props.theme.border}`};
  background: ${props => props.theme.border};
  color: ${props => props.theme.textColor};

  margin: 16px;
  padding: 8px;
  font-size: 0.75rem;

  & .button-link {
    text-decoration: underline;
    cursor: pointer;

    font-size: 14px;
  }

  & .title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  & .label {
    color: ${props => props.theme.primaryLight};
    font-style: italic;
  }

  & .word-spacer {
    margin-right: 4px;
  }

  & .time-info {
    font-size: 0.64rem;
  }

  & .inline-holder > div {
    display: inline;
  }
`

function FocusEvents({ stringified }: Props) {
  const [showEvents, setEventsVisibility] = useState(false)
  const [events, setEvents] = useState<Array<FocusEvent>>([])

  useEffect(() => {
    const parsed = parse(stringified)
    setEvents(parsed)
  }, [stringified, setEvents])

  if (isEmpty(events)) {
    return null
  }

  if (showEvents) {
    return (
      <Holder
        onClick={() => {
          setEventsVisibility(false)
        }}
      >
        <div className="title">{'Tab focus events'}</div>
        {events.map((current, index, all) => {
          const next = all[index + 1]

          return <Summary key={index} current={current} next={next} />
        })}
        <div className="button-link">{'Hide focus events'}</div>
      </Holder>
    )
  }

  return (
    <div
      className="button-link"
      onClick={() => {
        setEventsVisibility(true)
      }}
      style={{
        textDecoration: 'underline',
        fontSize: '14px',
        cursor: 'pointer',
      }}
    >
      {'Show focus events'}
    </div>
  )
}

export default FocusEvents

function Summary({
  current,
  next,
}: {
  current: FocusEvent
  next: FocusEvent | undefined
}) {
  return (
    <div className="inline-holder">
      <div className="label word-spacer">
        {current.type === 'FOCUS_IN'
          ? `Focussed in ${next ? 'for' : ''}`
          : `Focussed out ${next ? 'for' : ''}`}
      </div>
      {next ? (
        <div className="word-spacer">
          {formattedWebSessionDuration(current.timestamp, next?.timestamp)}
        </div>
      ) : (
        <div className="word-spacer">{'till end of session'}</div>
      )}
      <div className="inline-holder word-spacer">
        <div className="label word-spacer">{'from'}</div>
        <div>{new Date(current.timestamp).toString()}</div>
      </div>
      {next && (
        <div className="inline-holder word-spacer">
          <div className="label word-spacer">{'to'}</div>
          <div>{new Date(next.timestamp).toString()}</div>
        </div>
      )}
    </div>
  )
}

// helper function to parse focus events string to array of focus events
function parse(events: string): Array<FocusEvent> {
  try {
    return JSON.parse(events) as Array<FocusEvent>
  } catch (e) {
    return []
  }
}
