import React, { useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { styled as muiStyled } from '@mui/material/styles'
import styled from '@emotion/styled'
import { Drawer, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { createQueries, Store } from 'tinybase'
import { useStore } from 'tinybase/ui-react'
import { useSnackbar } from 'notistack'

import {
  TIME_TRACKED_SITES_TABLE,
  WEB_SESSIONS_TABLE,
} from '@background/time-tracker/store'
import ConfirmDeleteModal from '@app/Components/GenericConfirmDeleteModal'
import { Screens } from '@app/Util/Enums'

const PREFIX = 'SettingsModal'

const classes = {
  deleteButton: `${PREFIX}-deleteButton`,
  closeButton: `${PREFIX}-closeButton`,
}

const Holder = muiStyled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '314px',
  background: theme.colors.background,
  color: theme.colors.textColor,

  [`& .${classes.deleteButton}`]: {
    margin: theme.spacing(0),
    background: theme.colors.danger,
    color: theme.colors.highlightTextColor,

    '&:hover': {
      background: theme.colors.danger,
      color: theme.colors.highlightTextColor,
      opacity: 0.89,
    },
  },

  [`& .${classes.closeButton}`]: {
    background: theme.colors.primaryDark,
    color: theme.colors.textColor,
    borderColor: theme.colors.border,

    '&:hover': {
      // background: theme.colors.backgroundLight,
      opacity: 0.89,
    },
  },
}))

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: ${props => `thin solid ${props.theme.border}`};

  padding: 16px 24px;
  padding-right: 20px;
`

const HelpInfo = styled.div`
  font-size: 0.89rem;
  font-style: italic;

  margin: 8px;
  margin-top: auto;
  padding: 8px;
  border-radius: 5px;

  border: ${props => `thin solid ${props.theme.primaryDark}`};
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
`

type Props = {
  isModalOpen: boolean
  setModalStatus: React.Dispatch<React.SetStateAction<boolean>>
  site: string
}

const QUERY_ALL_SITE_SESSIONS = 'query_all_site_sessions'

function Settings({ isModalOpen, setModalStatus, site }: Props) {
  const store: Store = useStore() as Store
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  // confirm modal status
  const [isDeleteModalOpen, setDeleteModalStatus] = useState(false)
  // track deleting status
  const [deleting, setDeleting] = useState(false)

  const deleteSite = useCallback(() => {
    store?.transaction(() => {
      // delete site from tracked sites
      store.delRow(TIME_TRACKED_SITES_TABLE, site)
      // delete all web sessions for the site
      const queries = createQueries(store).setQueryDefinition(
        QUERY_ALL_SITE_SESSIONS,
        WEB_SESSIONS_TABLE,
        ({ select, where }) => {
          select('session_id')
          where('site', site)
        }
      )
      queries.forEachResultRow(QUERY_ALL_SITE_SESSIONS, rowId => {
        store.delRow(WEB_SESSIONS_TABLE, rowId)
      })
    })
  }, [store, site])

  return (
    <div role="presentation">
      <Drawer
        open={isModalOpen}
        anchor={'bottom'}
        onClose={() => {
          setModalStatus(false)
        }}
      >
        <Holder>
          <HelpInfo>
            {
              'Removing the site will stop tracking for the site. All the existing activity logs for the site will be deleted permanently.'
            }
          </HelpInfo>
          <ActionBar>
            <Button
              variant="contained"
              disabled={deleting}
              className={classes.deleteButton}
              startIcon={<DeleteIcon />}
              onClick={() => {
                // close settings modal
                setModalStatus(false)
                // open delete confirmation modal
                setDeleteModalStatus(true)
              }}
            >
              {deleting ? 'Removing site' : 'Remove site'}
            </Button>
            <Button
              variant="outlined"
              className={classes.closeButton}
              onClick={() => {
                setModalStatus(false)
              }}
            >
              {'Close'}
            </Button>
          </ActionBar>
        </Holder>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onDelete={() => {
          // close the modal
          setDeleteModalStatus(false)
          // start deletion
          setDeleting(true)
          // delete the site
          deleteSite()
          // mark as done
          setDeleting(false)
          // close the modal
          setModalStatus(false)
          // navigate to main time tracker screen
          history.push(Screens.TimeTracker)
          // show a toast
          enqueueSnackbar({
            message: `${site} removed`,
            variant: 'success',
          })
        }}
        closeModal={() => {
          setDeleteModalStatus(false)
        }}
        title={'Remove Site'}
        description={'Are you sure want to remove the site from time tracking?'}
        deleteButtonText="Remove site"
      />
    </div>
  )
}

export default Settings
