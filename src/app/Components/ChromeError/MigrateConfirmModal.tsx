import React from 'react'
import { styled } from '@mui/material/styles'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { AutoFixHigh } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { useSnackbar } from 'notistack'

import { migrateV1Remindoros } from '@app/Store/Slices/Remindoros'

const PREFIX = 'ConfirmMigration'

const classes = {
  paper: `${PREFIX}-paper`,
  migrateButton: `${PREFIX}-migrateButton`,
  cancelButton: `${PREFIX}-cancelButton`,
}

const StyledDialog = styled('div')(({ theme }) => ({
  background: theme.colors.primaryDark,
  color: theme.colors.textColor,

  '& .migrate-dialog-description p': {
    color: theme.colors.textColor,
  },

  '& .migrate-dialog-description p.highlight': {
    background: theme.colors.primaryLight,
    color: theme.colors.textColor,

    padding: '8px',
  },

  '& .action-holder': {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0 16px',
  },

  [`& .${classes.migrateButton}`]: {
    margin: theme.spacing(0),
    background: theme.colors.danger,
    color: theme.colors.textColor,

    '&:hover': {
      background: theme.colors.danger,
      color: theme.colors.textColor,
      opacity: 0.89,
    },
  },

  [`& .${classes.cancelButton}`]: {
    margin: theme.spacing(0),
    background: theme.colors.backgroundLight,
    color: theme.colors.textColor,
    borderColor: theme.colors.border,
    '&:hover': {
      background: theme.colors.background,
    },
  },
}))

type Props = {
  isOpen: boolean

  closeModal: () => void
}

function ConfirmMigrate({ isOpen, closeModal }: Props) {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  return (
    <Dialog
      className={'migrate-dialog'}
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="migrate-dialog-title"
      aria-describedby="migrate-dialog-description"
    >
      <StyledDialog className={classes.paper}>
        <DialogTitle id="migrate-dialog-title">
          {'Fix Reminder Data'}
        </DialogTitle>
        <DialogContent className={'migrate-dialog-description'}>
          <DialogContentText id="migrate-dialog-description">
            {`After upgrading to new 1.x remindoro, if you find any anomalies with your reminders (or notes), please click 'Fix Reminder data' to fix data issues. This is because of an anomaly in Chrome browser during the update process.`}
          </DialogContentText>
          <p className={'highlight'}>
            {`Please note this data fix will remove html tags (like <div></div>) from your notes for better security. In case your don't want this behaviour and not choose to fix the reminder data, you can fix you reminders by rescheduling them (by turning off reminder and then turning on again). For better experience, you can also create a new reminder/note with old content and delete the old reminder.`}
          </p>
        </DialogContent>
        <DialogActions className={'action-holder'}>
          <Button
            variant="contained"
            className={classes.migrateButton}
            startIcon={<AutoFixHigh />}
            onClick={() => {
              // migrate remindoros
              dispatch(migrateV1Remindoros())
              // close the modal
              closeModal()
              // notify the user
              enqueueSnackbar('Reminder data fixed', {
                variant: 'success',
              })
            }}
            autoFocus
          >
            {'Fix Reminder Data'}
          </Button>

          <Button onClick={closeModal} className={classes.cancelButton}>
            Cancel
          </Button>
        </DialogActions>
      </StyledDialog>
    </Dialog>
  )
}

export default ConfirmMigrate
