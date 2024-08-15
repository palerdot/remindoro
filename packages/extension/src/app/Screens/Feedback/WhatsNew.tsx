import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

// import { WHATS_NEW, WHATS_UP } from '@background/utils/'
import Content from './Changelog/Content'

type Props = {
  isOpen: boolean
  closeModal: () => void
}

function WhatsNewModal({ isOpen, closeModal }: Props) {
  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      fullWidth={true}
      maxWidth={'md'}
      scroll={'paper'}
    >
      <DialogTitle>{`What's New and What's Up!`}</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText></DialogContentText>
        <Content />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeModal()}>{'Close'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default WhatsNewModal
