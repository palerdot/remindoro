import styled from '@emotion/styled'
import { ContactMail } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import EmailNotification from './EmailNotification'

const Info = styled.div`
  padding: 2px;
  padding-left: 8px;
  font-size: 14px;
  font-style: italic;

  color: ${props => props.theme.palette.secondary.main};
`

function Content() {
  return (
    <Box component={'div'}>
      <Stack spacing={2}>
        <div>
          <strong>
            {'IMPORTANT: Time Tracking will be removed in upcoming version.'}
          </strong>
          {
            'Time tracking feature will be removed because of browser constraints and limitations.'
          }
        </div>
        <div>
          {
            'Email Reminders is now in private beta. If you are interested in this feature, please reach out below.'
          }
        </div>
        <Stack direction={'row'}>
          <ContactMail fontSize="medium" color="primary" />
          <Info>{'Sent reminder at 11AM to "myfamily@gmail.com"'}</Info>
        </Stack>
        <EmailNotification />
      </Stack>
    </Box>
  )
}

export default Content
