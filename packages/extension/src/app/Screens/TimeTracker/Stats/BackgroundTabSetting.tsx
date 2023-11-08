import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import { Store } from 'tinybase'
import { useStore, useRow } from 'tinybase/ui-react'

import {
  TrackedSite,
  TIME_TRACKED_SITES_TABLE,
} from '@background/time-tracker/store'
import Switch from '@app/Components/Switch'

const Holder = styled.div`
  display: flex;
  flex-direction: column;

  height: auto;
  padding: 16px 24px;

  border-top: ${props => `thin solid ${props.theme.border}`};
`

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;

  & .first-col {
    display: flex;
    flex: 1;
  }

  & .second-col {
    display: flex;
    flex: 3;
    margin: 0 24px;
  }
`

const HelpInfo = styled.div`
  font-size: 0.89rem;
  font-style: italic;

  margin-top: 8px;
  padding: 8px;
  border-radius: 5px;

  border: ${props => `thin solid ${props.theme.primaryDark}`};
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
`

const LABEL = 'Video/Streaming/Multimedia site mode'

type Props = {
  site: string
}

function BackgroundTabSetting({ site }: Props) {
  const store = useStore() as Store
  const siteInfo: TrackedSite = useRow(
    TIME_TRACKED_SITES_TABLE,
    site
  ) as TrackedSite

  const updateStatus = useCallback(
    (has_background_activity: boolean) => {
      store.setPartialRow(TIME_TRACKED_SITES_TABLE, site, {
        has_background_activity,
      })
    },
    [store, site]
  )

  return (
    <Holder>
      <Row>
        <div className={'first-col'}>
          <Switch
            checked={!!siteInfo.has_background_activity}
            setChecked={status => {
              updateStatus(status)
            }}
            ariaLabel={LABEL}
          />
        </div>
        <div className={'second-col'}>{LABEL}</div>
      </Row>
      <HelpInfo>
        {
          'Experimental: Enable this mode for streaming sites like youtube.com if you watch them in Picture-in-Picture mode or run them in background. If enabled, tab is considered active even if it is in background and if you are browsing other sites.'
        }
      </HelpInfo>
    </Holder>
  )
}

export default BackgroundTabSetting
