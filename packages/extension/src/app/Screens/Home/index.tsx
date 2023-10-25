import React from 'react'
import styled from '@emotion/styled'

import TimeTrackerGist from '@app/Screens/TimeTracker/DashboardGist'
import { DashboardGist as RemindorosGist } from '@app/Screens/Remindoros'

const Holder = styled.div`
  padding: 16px;
  margin-bottom: 8px;

  & .title {
    font-size: 1.25rem;
  }
`

function Home() {
  return (
    <div>
      <Holder>
        <div className="title">{'Dashboard'}</div>
      </Holder>
      <TimeTrackerGist />
      <RemindorosGist />
    </div>
  )
}

export default Home
