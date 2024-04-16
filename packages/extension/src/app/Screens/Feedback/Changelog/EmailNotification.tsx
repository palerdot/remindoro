import React, { useState, useCallback } from 'react'
import { useSnackbar } from 'notistack'
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { ContactMail } from '@mui/icons-material'

import PrivateBetaEmail from '../PrivateBeta'

function EmailNotification() {
  const { enqueueSnackbar } = useSnackbar()

  const showSuccessMessage = useCallback(() => {
    enqueueSnackbar('Thank you for the feedback', {
      variant: 'success',
    })
  }, [enqueueSnackbar])

  return (
    <PrivateBetaEmail
      context={'EMAIL_REMINDERS'}
      title={'Email Reminders'}
      subtitle={
        'Get Email reminder notifications. For e.g. Send "My reminder" at 11 AM to "myfamily@gmail.com". This feature is in private beta.'
      }
      onSuccess={showSuccessMessage}
      onError={message => {
        enqueueSnackbar(message, {
          variant: 'error',
        })
      }}
    />
  )
}

export default EmailNotification

export function EmailReminderModalButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        <ContactMail />
        <span
          style={{
            padding: '4px',
          }}
        >
          {'Get Email Reminders'}
        </span>
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth={true}
        maxWidth={'xl'}
        scroll={'paper'}
      >
        <DialogTitle>{`Email Reminders - Private Beta`}</DialogTitle>
        <DialogContent dividers={true}>
          <EmailNotification />
        </DialogContent>
        <Button onClick={() => setOpen(false)}>{'Close'}</Button>
      </Dialog>
    </>
  )
}
