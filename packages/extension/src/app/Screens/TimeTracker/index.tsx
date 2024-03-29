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
import PrivateBetaEmail from '@app/Components/PrivateBeta/Email'
import Faq from '@app/Components/TimeTracker/Faq'

const Holder = styled.div`
  & .title-holder {
    display: flex;
    flex-direction: row;
    align-items: center;

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
  const allow_site_tracking = isEmpty(time_tracked_sites)

  return (
    <div>
      <Holder>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 16px',
          }}
        >
          <div className="title-holder">
            <PendingActionsIcon fontSize="medium" />
            <div className="title">{'Browsing Time Tracker'}</div>
            <div className="beta">{'BETA'}</div>
          </div>
          <Faq showIcon={true} text={'FAQ'} />
        </div>
        <div className="content">
          {values(time_tracked_sites).map(x => {
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
                  <Subtitle>{`Click to view summary for ${row.site}`}</Subtitle>
                </div>
              </CardHolder>
            )
          })}
          {allow_site_tracking && (
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
          )}

          <div
            style={{
              paddingTop: '16px',
            }}
          >
            <PrivateBetaEmail
              onSuccess={() => {
                enqueueSnackbar({
                  message: 'Thank you for your interest',
                  variant: 'success',
                })
              }}
              onError={message => {
                enqueueSnackbar({
                  message,
                  variant: 'error',
                })
              }}
            />
          </div>
        </div>
      </Holder>
      <AddSiteFab
        onClick={() => {
          if (allow_site_tracking) {
            setModalStatus(true)
          }
        }}
      />
      <AddSiteModal
        isOpen={isModalOpen}
        closeModal={() => setModalStatus(false)}
        title={
          allow_site_tracking
            ? 'Add site for time tracking'
            : 'Private Beta Feature'
        }
      >
        {allow_site_tracking ? (
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
          <div>
            {'Tracking more than one site is currently in private beta.'}
          </div>
        )}
      </AddSiteModal>
    </div>
  )
}

export default TimeTracker
