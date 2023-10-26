import React, { useState } from 'react'
import { PendingActions as PendingActionsIcon } from '@mui/icons-material'
import { useTable } from 'tinybase/ui-react'
import { isEmpty } from '@lodash'
import { useSnackbar } from 'notistack'

import { TIME_TRACKED_SITES_TABLE } from '@background/time-tracker/store'
import AddSiteFab, {
  AddSiteButton,
} from '@app/Components/TimeTracker/AddSite/AddSiteFab'
import AddSite from '@app/Components/TimeTracker/AddSite'
import AddSiteModal from '@app/Components/TimeTracker/AddSite/AddSiteModal'
import { Holder } from './DashboardGist'

function TimeTracker() {
  const { enqueueSnackbar } = useSnackbar()

  const [isModalOpen, setModalStatus] = useState(false)
  const time_tracked_sites = useTable(TIME_TRACKED_SITES_TABLE)

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
        title={
          isEmpty(time_tracked_sites)
            ? 'Add site for time tracking'
            : 'Private Beta Feature'
        }
      >
        {isEmpty(time_tracked_sites) ? (
          <AddSite
            onSuccess={host => {
              // close the modal
              setModalStatus(false)
              // show success toast
              enqueueSnackbar({
                message: `${host} added for time tracking.`,
                variant: 'success',
              })
            }}
          />
        ) : (
          <div>{'porumai ... feature in private beta'}</div>
        )}
      </AddSiteModal>
    </div>
  )
}

export default TimeTracker
