import React, { useState } from 'react'
import styled from 'styled-components'
import { IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'

import WithChromeError from './WithChromeError'
import MigrateModal from './MigrateConfirmModal'

const Holder = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  background: ${props => props.theme.danger};
  color: ${props => props.theme.textColor};

  & .close-button {
    margin-left: auto;
    color: ${props => props.theme.textColor};

    &:hover {
      opacity: 0.89;
    }
  }

  & .info {
    padding-left: 16px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`

function FooterItem() {
  const [show, setStatus] = useState(true)
  const [isModalOpen, setModalStatus] = useState(false)

  return (
    <WithChromeError>
      {show && (
        <Holder>
          <div
            className={'info'}
            onClick={() => {
              setModalStatus(true)
            }}
          >
            {'Fix Reminder Data'}
          </div>
          <div
            className={'close-button'}
            onClick={() => {
              setStatus(false)
            }}
          >
            <IconButton>
              <Close />
            </IconButton>
          </div>
        </Holder>
      )}
      <MigrateModal
        isOpen={isModalOpen}
        closeModal={() => {
          setModalStatus(false)
        }}
      />
    </WithChromeError>
  )
}

export default FooterItem
