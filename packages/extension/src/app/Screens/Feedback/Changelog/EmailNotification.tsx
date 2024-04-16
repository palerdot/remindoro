import React, { useCallback } from 'react'
import { useSnackbar } from 'notistack'

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
