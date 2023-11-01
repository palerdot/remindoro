import React from 'react'
import styled from '@emotion/styled'

import TimeTrackerGist from '@app/Screens/TimeTracker/DashboardGist'
import { DashboardGist as RemindorosGist } from '@app/Screens/Remindoros'

const Holder = styled.div`
  padding-bottom: 34px;

  & .title-holder {
    padding: 16px;
    margin-bottom: 8px;

    & .title {
      font-size: 1.25rem;
    }
  }
`

function Home() {
  return (
    <Holder>
      <div className="title-holder">
        <div className="title">{'Dashboard'}</div>
      </div>

      <TimeTrackerGist />
      <RemindorosGist />
    </Holder>
  )
}

export default Home
