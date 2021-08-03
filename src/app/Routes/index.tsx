import React from 'react'
import { Switch, Route } from 'react-router-dom'
import styled from 'styled-components'

import Home from '@app/Screens/Home/'
import Scheduled from '@app/Screens/Scheduled/'
import RemindoroInfo from '@app/Screens/RemindoroInfo/'

export enum Screens {
  Home = '/',
  Scheduled = '/scheduled',
  RemindoroInfo = '/remindoro-info/:id',
}

const PATHS = [
  {
    path: Screens.Home,
    Screen: Home,
  },
  {
    path: Screens.Scheduled,
    Screen: Scheduled,
  },
  // NOTE: This screen will not have an explicit 'Link'
  // Will always be pushed to 'history' with remindoro data as state
  {
    path: Screens.RemindoroInfo,
    Screen: RemindoroInfo,
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
