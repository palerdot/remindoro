import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Screens } from '@app/Routes/'
import Activity from './Activity'
import EditFab from '@app/Components/EditFab'
import SettingsModal from './Settings'

type Maybe<T> = T | undefined

function Stats({ site }: { site: string }) {
  // settings modal status
  const [isSettingsModalOpen, setSettingsModalStatus] = useState(false)

  return (
    <div>
      <Activity site={site} />
      {/* Edit Fab */}
      <EditFab
        onClick={() => {
          setSettingsModalStatus(true)
        }}
      />
      {/* Settings Modal */}
      <SettingsModal
        isModalOpen={isSettingsModalOpen}
        setModalStatus={setSettingsModalStatus}
        site={site}
      />
    </div>
  )
}

function Checker() {
  const pathInfo = useParams<
    Maybe<{
      site: string
    }>
  >()

  if (!pathInfo?.site) {
    // IMPORTANT: This edge case should never happen
    return (
      <div>
        {
          'Cannot find information ... Please give feedback if you encounter this issue'
        }
        <Link to={Screens.Home}>{'Go to Home'}</Link>
      </div>
    )
  }

  const { site } = pathInfo

  return <Stats site={site} />
}

export default Checker
