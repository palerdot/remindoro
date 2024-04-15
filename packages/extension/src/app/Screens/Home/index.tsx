import React from 'react'
import { useSelector } from 'react-redux'

import type { RootState } from '@app/Store/'

import { HomeScreenSetting } from '@app/Store/Slices/Settings'
import RemindorosScreen from '@app/Screens/Remindoros'
import DashboardScreen from '@app/Screens/Dashboard'

function Home() {
  const homeScreen = useSelector(
    (state: RootState) => state.settings.homeScreen
  )

  return (
    <div>
      {homeScreen === HomeScreenSetting.Reminders ? (
        <RemindorosScreen />
      ) : (
        <DashboardScreen />
      )}
    </div>
  )
}

export default Home
