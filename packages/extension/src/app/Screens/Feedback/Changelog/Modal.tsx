import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'

import { useCurrentVersion } from '@app/Store'
import { addChangelogHistory, cleanOldHistories } from '@app/Store/Slices/Temp'
import Content from './Content'

type Props = {
  isOpen: boolean
  closeModal: () => void
}

function ChangelogModal({ isOpen, closeModal }: Props) {
  const dispatch = useDispatch()
  const version = useCurrentVersion()

  useEffect(() => {
    dispatch(
      cleanOldHistories({
        version,
      })
    )
  }, [version, dispatch])

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      fullWidth={true}
      maxWidth={'xl'}
      scroll={'paper'}
    >
      <DialogTitle>{`v${version} - What's New and What's Up!`}</DialogTitle>
      <DialogContent dividers={true}>
        <Content />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(
              addChangelogHistory({
                version,
              })
            )
          }}
        >
          {'Dont show again'}
        </Button>
        <Button onClick={() => closeModal()}>{'Close'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangelogModal
