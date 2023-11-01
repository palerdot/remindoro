import React from 'react'
import { Switch, Route } from 'react-router-dom'
import styled from '@emotion/styled'

import Home from '@app/Screens/Home/'
import Account from '@app/Screens/Account'
// remindoros
import Remindoros from '@app/Screens/Remindoros/'
import Todo from '@app/Screens/Todo/'
import Scheduled from '@app/Screens/Scheduled/'
import RemindoroInfo from '@app/Screens/RemindoroInfo/'
// time tracker
import TimeTracker from '@app/Screens/TimeTracker/'
import TimeTrackerStats from '@app/Screens/TimeTracker/Stats'
// general
import Settings from '@app/Screens/Settings/'
import Help from '@app/Screens/Help/'
import Feedback from '@app/Screens/Feedback/'
import { Screens } from '@app/Util/Enums'

export { Screens }

const PATHS = [
  {
    path: Screens.Home,
    Screen: Home,
  },
  {
    path: Screens.Account,
    Screen: Account,
  },
  // remindoros
  {
    path: Screens.Remindoros,
    Screen: Remindoros,
  },
  {
    path: Screens.Todo,
    Screen: Todo,
  },
  {
    path: Screens.Scheduled,
    Screen: Scheduled,
  },
  {
    path: Screens.RemindoroInfo,
    Screen: RemindoroInfo,
  },
  // time tracker
  {
    path: Screens.TimeTracker,
    Screen: TimeTracker,
  },
  {
    path: Screens.TimeTrackerStats,
    Screen: TimeTrackerStats,
  },
  // general
  {
    path: Screens.Settings,
    Screen: Settings,
  },
  {
    path: Screens.Help,
    Screen: Help,
  },
  {
    path: Screens.Feedback,
    Screen: Feedback,
  },
]

const Holder = styled.div`
  width: 100%;
  /* padding: 0 12px; */
`

function Routes() {
  return (
    <Holder>
      <Switch>
        {PATHS.map(({ path, Screen }) => (
          <Route exact key={path} path={path}>
            <Screen />
          </Route>
        ))}
      </Switch>
    </Holder>
  )
}

export default Routes
