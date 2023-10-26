import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useHistory } from 'react-router-dom'
import { PendingActions as PendingActionsIcon } from '@mui/icons-material'
import { useTable } from 'tinybase/ui-react'
import { isEmpty, values } from '@lodash'
import { useSnackbar } from 'notistack'

import {
  TIME_TRACKED_SITES_TABLE,
  TrackedSite,
} from '@background/time-tracker/store'
import AddSiteFab, {
  AddSiteButton,
} from '@app/Components/TimeTracker/AddSite/AddSiteFab'
import AddSite from '@app/Components/TimeTracker/AddSite'
import AddSiteModal from '@app/Components/TimeTracker/AddSite/AddSiteModal'
import SiteGist from './SiteGist'
import CardHolder from '@app/Components/CardHolder'
import { Screens } from '@app/Util/Enums'

const Holder = styled.div`
  & .title-holder {
    display: flex;
    flex-direction: row;
    align-items: center;

    padding: 8px 16px;

    & .title {
      font-size: 1.25rem;
      font-weight: 500;
      margin: auto 8px;
    }

    & .beta {
      font-size: 0.75rem;
      font-style: italic;
    }
  }

  & .content {
  }
`

const Subtitle = styled.div`
  font-size: 0.75rem;
  font-style: italic;

  margin-bottom: 8px;

  display: flex;
  justify-content: center;
`

function TimeTracker() {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  const [isModalOpen, setModalStatus] = useState(false)
  const time_tracked_sites = useTable(TIME_TRACKED_SITES_TABLE)

  return (
    <div>
      <Holder>
        <div className="title-holder">
          <PendingActionsIcon fontSize="medium" />
          <div className="title">{'Browsing Time Tracker'}</div>
          <div className="beta">{'BETA'}</div>
        </div>
        <div className="content">
          {isEmpty(time_tracked_sites) ? (
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
          ) : (
            values(time_tracked_sites).map(x => {
              const row: TrackedSite = x as TrackedSite
              return (
                <CardHolder
                  key={row.site}
                  onClick={() => {
                    const url = Screens.TimeTrackerStats.replace(
                      ':site',
                      row.site
                    )
                    history.push(url)
                  }}
                >
                  <div
                    style={{
                      padding: '8px',
                    }}
                  >
                    <SiteGist {...row} />
                    <Subtitle>
                      {`Click to view summary for ${row.site}`}
                    </Subtitle>
                  </div>
                </CardHolder>
              )
            })
          )}
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
