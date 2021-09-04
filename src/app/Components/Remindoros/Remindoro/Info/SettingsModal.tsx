import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import {
  Drawer,
  Button,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { useSnackbar } from 'notistack'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'
import type { ThemeInterface } from '@app/Util/colors'

import { useTheme } from '@app/Hooks/'
import { Screens } from '@app/Routes/'
import { deleteRemindoro } from '@app/Store/Slices/Remindoros'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import Reminder from './Reminder/'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deleteButton: {
      margin: theme.spacing(0),
      background: (props: { theme: ThemeInterface }) => props.theme.danger,
      color: (props: { theme: ThemeInterface }) => props.theme.textColor,

      '&:hover': {
        background: (props: { theme: ThemeInterface }) => props.theme.danger,
        color: (props: { theme: ThemeInterface }) => props.theme.textColor,
        opacity: 0.89,
      },
    },

    closeButton: {
      background: (props: { theme: ThemeInterface }) => props.theme.primaryDark,
      color: (props: { theme: ThemeInterface }) => props.theme.textColor,
      borderColor: (props: { theme: ThemeInterface }) => props.theme.border,
      '&:hover': {
        background: (props: { theme: ThemeInterface }) =>
          props.theme.backgroundLight,
      },
    },
  })
)

const Holder = styled.div`
  display: flex;
  flex-direction: column;

  height: 314px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
`

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: ${props => `thin solid ${props.theme.border}`};

  margin-top: auto;
  padding: 16px;
`

type Props = {
  isModalOpen: boolean
  setModalStatus: React.Dispatch<React.SetStateAction<boolean>>

  remindoro: Remindoro
}

function SettingsModal({ isModalOpen, setModalStatus, remindoro }: Props) {
  const theme = useTheme()
  const classes = useStyles({ theme })
  const dispatch = useDispatch()
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  // confirm modal status
  const [isDeleteModalOpen, setDeleteModalStatus] = useState(false)

  return (
    <div role="presentation">
      {/* Setting Drawer */}
      <Drawer
        open={isModalOpen}
        anchor={'bottom'}
        onClose={() => {
          setModalStatus(false)
        }}
      >
        <Holder>
          <Reminder id={remindoro.id} reminder={remindoro.reminder} />
          <ActionBar>
            <Button
              variant="contained"
              className={classes.deleteButton}
              startIcon={<DeleteIcon />}
              onClick={() => {
                // close settings modal
                setModalStatus(false)
                // open delete confirmation modal
                setDeleteModalStatus(true)
              }}
            >
              Delete
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
          console.log('porumai ... will delete ', remindoro.id)
          // close the modal
          setDeleteModalStatus(false)
          // go to home page
          history.push(Screens.Home)
          // dispatch action to delete remindoro
          dispatch(deleteRemindoro(remindoro.id))
          // show success toast
          enqueueSnackbar('Delete success', {
            variant: 'success',
          })
        }}
        closeModal={() => {
          setDeleteModalStatus(false)
        }}
      />
    </div>
  )
}

export default SettingsModal
