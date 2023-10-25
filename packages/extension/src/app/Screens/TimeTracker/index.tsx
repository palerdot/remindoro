import React, { useState } from 'react'
import { PendingActions as PendingActionsIcon } from '@mui/icons-material'

import AddSiteFab, {
  AddSiteButton,
} from '@app/Components/TimeTracker/AddSite/AddSiteFab'
import AddSite from '@app/Components/TimeTracker/AddSite'
import AddSiteModal from '@app/Components/TimeTracker/AddSite/AddSiteModal'
import { Holder } from './DashboardGist'

function TimeTracker() {
  const [isModalOpen, setModalStatus] = useState(false)

  return (
    <div
      style={{
        padding: '8px',
      }}
    >
      <Holder>
        <div className="title-holder">
          <PendingActionsIcon fontSize="medium" />
          <div className="title">{'Browsing Time Tracker'}</div>
          <div className="beta">{'BETA'}</div>
        </div>
        <div className="content">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '16px auto',
            }}
          >
            <AddSiteButton
              onClick={() => {
                setModalStatus(true)
              }}
            />
          </div>
          <div>{'porumai ... time tracker'}</div>
        </div>
      </Holder>
      <AddSiteFab onClick={() => {}} />
      <AddSiteModal
        isOpen={isModalOpen}
        closeModal={() => setModalStatus(false)}
        title={'porumai'}
      >
        <AddSite
          onSuccess={() => {
            // close the modal
            setModalStatus(false)
          }}
        />
      </AddSiteModal>
    </div>
  )
}

export default TimeTracker
