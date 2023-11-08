import React, { useState } from 'react'
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Stack,
} from '@mui/material'
import { Help } from '@mui/icons-material'

import { isChrome, isFirefox } from '@background/utils'

type Props = {
  showIcon: boolean
  text: string
}

function Faq({ showIcon, text }: Props) {
  const [isOpen, setStatus] = useState(false)
  return (
    <span
      style={{
        height: 'fit-content',
      }}
    >
      <Stack direction={'row'} spacing={0} onClick={() => setStatus(true)}>
        {showIcon && (
          <IconButton
            component="span"
            sx={{
              color: theme => theme.colors.highlight,
              '&:hover': {
                opacity: 0.89,
              },
              margin: 0,
            }}
          >
            <Help fontSize="small" />
          </IconButton>
        )}
        <Box
          sx={{
            color: theme => theme.colors.highlight,
            textDecoration: 'underline',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.89,
            },
            margin: 'auto',
          }}
        >
          {text}
        </Box>
      </Stack>
      <Dialog
        open={isOpen}
        onClose={() => setStatus(false)}
        fullWidth={true}
        maxWidth={'md'}
        scroll={'paper'}
      >
        <DialogTitle>{'Browsing Time Tracker'}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText component={'div'}>
            <Stack direction={'column'} spacing={3}>
              {FAQS.map(({ question, answer }, index) => (
                <Stack key={index} direction={'column'} spacing={1}>
                  <Box
                    sx={{
                      color: theme => theme.colors.highlight,
                    }}
                  >
                    {question}
                  </Box>
                  <Box
                    sx={{
                      color: theme => theme.colors.textColor,
                    }}
                  >
                    {answer}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatus(false)}>{'Close'}</Button>
        </DialogActions>
      </Dialog>
    </span>
  )
}

export default Faq

const FAQS: Array<{
  question: string
  answer: string
}> = [
  {
    question: 'What is Time Tracker?',
    answer:
      'Time tracker helps you to track browsing time for your preferred websites (e.g. social media sites). The idea of time tracker is to help you have healthy digital habits.',
  },
  {
    question: 'What can I currently do with Time Tracker feature?',
    answer:
      'You can track browsing time for one website and see the activity for last 5 hours (or less depening on the browser). Please note that this feature is currently in beta, and more features like tracking more than one site and detailed statistics are currently in private beta.',
  },
  {
    question: 'Will I be asked permissions before tracking my browsing time?',
    answer: `Yes. You will be explicitly asked for permissions to track your tab details for the site. ${
      isChrome
        ? 'In chrome, if you see the popup window closing after you grant permission, please try again. Please note, chrome browser automatically closes extension popup window when lost focus which is a bug. For more details on this issue/bug visit https://bugs.chromium.org/p/chromium/issues/detail?id=952645, https://bugs.chromium.org/p/chromium/issues/detail?id=1131592#c4'
        : ''
    }${
      isFirefox
        ? 'In firefox, the permission popup is shown in the top left corner, which might be sometimes hidden below the extensions popup window. When you close the popup, you might see the permission popup and clicking on it will grant you permission for tracking site activity.'
        : ''
    }`,
  },
  {
    question: 'What are tab focus events shown in the summary page?',
    answer:
      'Tab focus events are best guess effort to show the timeline of tab/window focus state during your browsing session. It is updated atmost once per minute. Focussed out can mean different things like switching to a different applicaton, or viewing a browser developer tool window etc depending on your OS and browser environment.',
  },
  {
    question:
      'I view sites like youtube.com in Picture-In-Picture mode or in the background. Will this work properly for streaming sites?',
    answer:
      'Yes. There is a setting that allows to mark a site as streaming/multimedia mode. When enabled, a tab is considered active even if it is background when you are browsing other sites. This is helpful if you watch in Picture-In-Picture mode. Please note, this is an experimental feature because of non standard browser implementations.',
  },
  {
    question:
      'I have specific feature requests I would like to have like blocking web pages if exceeds configured time. Is it possible?',
    answer:
      'Yes. Please sign up for private beta to or email at arun@remindoro.app with your requirements. All the private beta feedback is currently being incorporated.',
  },
  {
    question: 'How can I sign up for private beta features?',
    answer:
      'Please use the form in the time tracker screen and sign up with your email to show you interest. I will follow up with you and possibly add you as part of private beta cohort.',
  },
  {
    question:
      'I would like to continue using this feature offline. Is it possible?',
    answer:
      'Yes. You can continue using this feature offline for tracking one website. Please note that because of the browser extension limitations and data eviction policy you cannot reliably store large number of offline data. Hence the limitation of one website and 5 hour cap for viewing the recent activity.',
  },
  {
    question: 'Is private beta a paid feature?',
    answer:
      'As of now it is not a paid feature. But once it is out of private beta, it will be a paid feature. Please note that all the private beta features will be part of a paid plan for a nominal monthly fee in the future.',
  },
  {
    question:
      'Why the private beta features are part of paid plan and not free?',
    answer:
      'Features are not free and part of a paid plan to cover the server costs and development time.',
  },
  {
    question:
      'I like to sign up for private beta. I would like to see the source of the extension to see what data is sent to server before signing up. It is possible?',
    answer:
      'Yes. You can view the source of the extension here - https://github.com/palerdot/remindoro',
  },
]
