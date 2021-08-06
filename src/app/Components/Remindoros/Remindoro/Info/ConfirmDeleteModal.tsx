import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from '@material-ui/core'

import { Delete as DeleteIcon } from '@material-ui/icons'

import type { ThemeInterface } from '@app/Util/colors'

import { useTheme } from '@app/Hooks/'

const useStyles = makeStyles({
  paper: (props: { theme: ThemeInterface }) => ({
    // background: '#AAAAAA',
    background: props.theme.primary,
    color: '#DEDEDE',

    '& .delete-dialog-description p': {
      color: '#DEDEDE',
    },

    '& .action-holder': {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '0 16px',
    },
  }),
})

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
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={() => {
            onDelete()
          }}
          autoFocus
        >
          Delete
        </Button>

        <Button onClick={closeModal} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDelete
