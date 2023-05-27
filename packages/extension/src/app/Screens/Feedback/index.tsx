import React, { useState, useCallback, useRef } from 'react'
import { isEmpty } from '@lodash'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'

import { Screens } from '@app/Util/Enums'
import { postData } from '@app/Util/config'
import { Holder, Header } from './Styles'
import WhatsNew from './WhatsNew'

function Feedback() {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  const [inProgress, setProgress] = useState(false)
  const $textarea = useRef<HTMLTextAreaElement>(null)

  const showSuccessMessage = useCallback(
    (message: string) => {
      enqueueSnackbar(message || 'Thank you for the feedback', {
        variant: 'success',
      })
      // move to home screen
      history.push(Screens.Home)
    },
    [history, enqueueSnackbar]
  )

  const showErrorMessage = useCallback(
    (message: string) => {
      enqueueSnackbar(message || 'Please try again', {
        variant: 'error',
      })
    },
    [enqueueSnackbar]
  )

  return (
    <Holder>
      <Header>
        <div className={'title'}>Feedback</div>
        <div className={'subtitle'}>
          {
            'If you have any feedback regarding feature requests or issues, please share it here.'
          }
        </div>
      </Header>
      <textarea
        ref={$textarea}
        rows={15}
        aria-label="Feedback"
        placeholder="Please provide your Feedback ... "
      />
      <div className="button-holder">
        <Button
          disabled={inProgress}
          variant="contained"
          endIcon={<SendIcon />}
          onClick={() => {
            const feedback = $textarea.current
              ? $textarea.current.value.trim()
              : ''
            if (isEmpty(feedback)) {
              return
            }

            const payload = {
              feedback,
              source: 'EXTENSION',
            }

            // disable button
            setProgress(true)

            postData(`/public_api/send_feedback`, payload)
              .then(res => {
                // decide if request is success
                if (res.ok) {
                  showSuccessMessage('Thank you for your Feedback')
                  // do not proceed
                  return
                }
                // we have to deal with some error
                if (res.status === 429) {
                  showErrorMessage('Please try again after some time')
                  return
                }

                // some error
                showErrorMessage('Problem sending feedback. Please try again.')
              })
              .catch(_err => {
                // network error mostly
                showErrorMessage(
                  'Please check your network connection and try again'
                )
              })
              .finally(() => {
                // enable button
                setProgress(false)
              })
          }}
        >
          Send Feedback
        </Button>
      </div>
      <WhatsNew />
    </Holder>
  )
}

export default Feedback
