import React, { useState } from 'react'
import { styled as muiStyled } from '@mui/material/styles'
import { useHistory } from 'react-router-dom'
import styled from '@emotion/styled'
import { useDispatch } from 'react-redux'
import { Drawer, Button } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material/'
import { useSnackbar } from 'notistack'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import { Screens } from '@app/Routes/'
import { deleteRemindoro } from '@app/Store/Slices/Remindoros'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import Reminder from './Reminder/'
import MarkTodo from './MarkTodo'

const PREFIX = 'SettingsModal'

const classes = {
  deleteButton: `${PREFIX}-deleteButton`,
  closeButton: `${PREFIX}-closeButton`,
}

const Root = styled.div``

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
  border-top: ${(props: any) => `thin solid ${props.theme.border}`};

  margin-top: auto;
  padding: 16px 24px;
  padding-right: 20px;
`

type Props = {
  isModalOpen: boolean
  setModalStatus: React.Dispatch<React.SetStateAction<boolean>>

  remindoro: Remindoro
}

function SettingsModal({ isModalOpen, setModalStatus, remindoro }: Props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  // confirm modal status
  const [isDeleteModalOpen, setDeleteModalStatus] = useState(false)

  return (
    <Root role="presentation">
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
          <MarkTodo id={remindoro.id} isTodo={remindoro.isTodo} />
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
    </Root>
  )
}

export default SettingsModal
