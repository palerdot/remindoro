import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Theme,
} from '@material-ui/core'

import { Delete as DeleteIcon } from '@material-ui/icons'

import type { ThemeInterface } from '@app/Util/colors'

import { useTheme } from '@app/Hooks/'

const useStyles = makeStyles((theme: Theme) => ({
  paper: (props: { theme: ThemeInterface }) => ({
    // background: '#AAAAAA',
    background: props.theme.primaryDark,
    color: props.theme.textColor,

    '& .delete-dialog-description p': {
      color: props.theme.textColor,
    },

    '& .action-holder': {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '0 16px',
    },
  }),

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

  cancelButton: {
    margin: theme.spacing(0),
    background: (props: { theme: ThemeInterface }) =>
      props.theme.backgroundLight,
    color: (props: { theme: ThemeInterface }) => props.theme.textColor,
    borderColor: (props: { theme: ThemeInterface }) => props.theme.border,
    '&:hover': {
      background: (props: { theme: ThemeInterface }) => props.theme.background,
    },
  },
}))

type Props = {
  isOpen: boolean

  closeModal: () => void
  onDelete: () => void
}

function ConfirmDelete({ isOpen, closeModal, onDelete }: Props) {
  const theme = useTheme()
  const classes = useStyles({ theme })

  return (
    <Dialog
      className={'delete-dialog'}
      classes={{
        paper: classes.paper,
      }}
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
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
    </Dialog>
  )
}

export default ConfirmDelete
