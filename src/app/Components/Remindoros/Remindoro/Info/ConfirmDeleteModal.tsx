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
import { Delete as DeleteIcon } from '@mui/icons-material'

const PREFIX = 'ConfirmDelete'

const classes = {
  paper: `${PREFIX}-paper`,
  deleteButton: `${PREFIX}-deleteButton`,
  cancelButton: `${PREFIX}-cancelButton`,
}

const StyledDialog = styled('div')(({ theme }) => ({
  background: theme.colors.primaryDark,
  color: theme.colors.textColor,

  '& .delete-dialog-description p': {
    color: theme.colors.textColor,
  },

  '& .action-holder': {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0 16px',
  },

  [`& .${classes.deleteButton}`]: {
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
  onDelete: () => void
}

function ConfirmDelete({ isOpen, closeModal, onDelete }: Props) {
  return (
    <Dialog
      className={'delete-dialog'}
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <StyledDialog
        classes={{
          paper: classes.paper,
        }}
      >
        <DialogTitle id="delete-dialog-title">{'Confirm Delete'}</DialogTitle>
        <DialogContent className={'delete-dialog-description'}>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to delete this note?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={'action-holder'}>
          <Button
            variant="contained"
            className={classes.deleteButton}
            startIcon={<DeleteIcon />}
            onClick={() => {
              onDelete()
            }}
            autoFocus
          >
            Delete
          </Button>

          <Button onClick={closeModal} className={classes.cancelButton}>
            Cancel
          </Button>
        </DialogActions>
      </StyledDialog>
    </Dialog>
  )
}

export default ConfirmDelete
