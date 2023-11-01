import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

type Props = {
  isOpen: boolean
  closeModal: () => void
  title: string
  children: React.ReactElement
}

function AddSiteModal({ isOpen, closeModal, title, children }: Props) {
  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      fullWidth={true}
      maxWidth={'md'}
      scroll={'paper'}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>{children}</DialogContent>
      <DialogActions>
        <Button onClick={closeModal} className={''}>
          {'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddSiteModal
