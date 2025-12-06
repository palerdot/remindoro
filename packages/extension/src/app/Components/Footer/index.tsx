import styled from '@emotion/styled'

import ToggleNotifications from '@app/Components/Settings/ToggleNotifications'
import MigrateChromeData from '@app/Components/ChromeError/FooterItem'
import WhatsNew from './WhatsNew'

const Holder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;

  border-top: ${props => `thin solid ${props.theme.palette.divider}`};
  background: ${props => props.theme.palette.background.paper};

  & .message-section {
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
  }

  & .icon-holder {
    display: flex;
    align-self: flex-start;

    padding: 0 6px;
  }
`

function Footer() {
  return (
    <Holder>
      <div className={'icon-holder'}>
        <ToggleNotifications />
        <WhatsNew />
      </div>
      <div className={'message-section'}>
        <MigrateChromeData />
      </div>
    </Holder>
  )
}

export default Footer
