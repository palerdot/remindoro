import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import type { RootState } from '@app/Store/'
import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import ScheduleInfo from '@app/Components/Remindoros/Remindoro/ScheduleInfo'
import SettingsModal from '@app/Components/Remindoros/Remindoro/Info/SettingsModal'
import Edit from '@app/Components/Remindoros/Remindoro/EditFab'
import Title from './Title'
import LiveNote from '@app/Components/LiveNote/'

const Holder = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-self: flex-start;
  margin: 0 16px;

  & .title-holder {
    height: 40px;

    border: thin solid red;

    & input {
      width: 100%;
      height: 100%;

      background: transparent;
      color: white;
      padding: 4px;
    }
  }

  & .note-holder {
    & .editor {
      height: 400px;
      overflow-y: auto;
    }
  }

  & .info-corner {
    display: flex;
    height: 30px;

    & .info {
      margin-left: auto;
    }
  }
`

type Maybe<T> = T | undefined

type Props = {
  remindoroId: string
}

function Info({ remindoroId }: Props) {
  // fetch remindoro details from store
  // NOTE: we are using String(ro.id) as an extra guard
  // so that our 1.x update will work fine even without migration
  const remindoro: Maybe<Remindoro> = useSelector((state: RootState) =>
    state.remindoros.find(ro => String(ro.id) === remindoroId)
  )

  // settings modal status
  const [isSettingsModalOpen, setSettingsModalStatus] = useState(false)

  if (!remindoro) {
    // probably adding our new remindoro to store
    return <div>{'Loading ... '}</div>
  }

  const { id, title, note, reminder } = remindoro

  return (
    <Holder>
      <div className={'info-corner'}>
        <ScheduleInfo reminder={reminder} />
      </div>

      <div className={'title-holder'}>
        <Title id={id} title={title} />
      </div>
      <div className={'note-holder'}>
        <LiveNote id={id} note={note} readOnly={false} />
      </div>

      {/* Edit Fab */}
      <Edit
        onClick={() => {
          setSettingsModalStatus(true)
        }}
      />
      {/* Settings Modal */}
      <SettingsModal
        isModalOpen={isSettingsModalOpen}
        setModalStatus={setSettingsModalStatus}
        remindoro={remindoro}
      />
    </Holder>
  )
}

export default Info