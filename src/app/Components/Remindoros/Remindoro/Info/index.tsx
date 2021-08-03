import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Repeat as RepeatIcon } from '@material-ui/icons'

import type { RootState } from '@app/Store/'
import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import SettingsModal from '@app/Components/Remindoros/Remindoro/Info/SettingsModal'
import Edit from '@app/Components/Remindoros/Remindoro/EditFab'
import Timeago from '@app/Components/Timeago'
import Title from './Title'
import Note from './Note'

const Holder = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-self: flex-start;

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
    height: 400px;

    overflow-y: auto;
    border: thin solid green;
  }

  & .schedule-holder {
    display: flex;
    align-items: center;
    height: 30px;

    border: thin solid yellow;

    & .time-holder {
      display: flex;
    }
  }
`

type Maybe<T> = T | undefined

type Props = {
  remindoroId: string
}

function Info({ remindoroId }: Props) {
  // fetch remindoro details from store
  const remindoro: Maybe<Remindoro> = useSelector((state: RootState) =>
    state.remindoros.find(ro => ro.id === remindoroId)
  )

  // settings modal status
  const [isModalOpen, setModalStatus] = useState(false)

  if (!remindoro) {
    // probably adding our new remindoro to store
    return <div>{'Loading ...'}</div>
  }

  const { id, title, note, reminder } = remindoro

  return (
    <Holder>
      <div className={'schedule-holder'}>
        {reminder && (
          <div className={'time-holder'}>
            <Timeago timestamp={reminder.time} />
            {reminder.repeat && <RepeatIcon />}
          </div>
        )}
      </div>
      <div className={'title-holder'}>
        <Title id={id} title={title} />
      </div>
      <div className={'note-holder'}>
        <Note id={id} note={note} readOnly={false} />
      </div>

      {/* Edit Fab */}
      <Edit
        onClick={() => {
          setModalStatus(true)
        }}
      />
      {/* Settings Modal */}
      <SettingsModal
        isModalOpen={isModalOpen}
        setModalStatus={setModalStatus}
        remindoro={remindoro}
      />
    </Holder>
  )
}

export default Info
