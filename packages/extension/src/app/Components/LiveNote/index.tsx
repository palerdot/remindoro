import { useMemo } from 'react'
import { debounce, isEqual, type DebouncedFunc } from '@lodash'
import { useSelector, useDispatch } from 'react-redux'
import Slite, { Editor } from 'react-slite'

import type { RootState } from '@app/Store/'

import { updateNote } from '@app/Store/Slices/Remindoros'
import ActionBar from './ActionBar'
import BackupEditor from './BackupEditor'
import PlainTextEditor from '@app/Components/LiveNote/PlainTextEditor'
import { EditorHolder } from './helpers'
import { setLiveNoteStatus } from '@app/Store/Slices/Settings'

type Props = {
  id: string
  note: string
  readOnly?: boolean
}

function LiveNote({ id, note, readOnly }: Props) {
  const dispatch = useDispatch()

  const lazyUpdate = useMemo(
    () =>
      debounce(updatedNote => {
        if (!isEqual(note, updatedNote)) {
          dispatch(
            updateNote({
              id,
              value: updatedNote,
            })
          )
        }
      }, 314),
    [id, dispatch, note]
  )

  return (
    <EditorHolder className={`editor ${readOnly ? 'readonly' : ''}`}>
      <Slite
        initialValue={note}
        onChange={updatedNote => {
          lazyUpdate(updatedNote)
        }}
        readOnly={readOnly}
      >
        {!readOnly && <ActionBar liveNoteEnabled={true} />}
        <div className="react-slite">
          <Editor readOnly={readOnly} />
        </div>
      </Slite>
    </EditorHolder>
  )
}

interface WrapperProps extends Props {
  lazyUpdate: DebouncedFunc<(updatedNote: string) => void>
}

const NoteWrapper = ({ id, note, readOnly, lazyUpdate }: WrapperProps) => {
  const liveNoteEnabled = useSelector((state: RootState) => {
    return state.settings.liveNoteEnabled
  })

  return (
    <>
      {!readOnly && !liveNoteEnabled && <ActionBar liveNoteEnabled={false} />}
      {liveNoteEnabled ? (
        <LiveNote id={id} note={note} readOnly={readOnly} />
      ) : (
        <PlainTextEditor
          id={id}
          note={note}
          readOnly={readOnly}
          onChange={lazyUpdate}
        />
      )}
    </>
  )
}

const ResilientLiveNote = ({ id, readOnly, note }: Props) => {
  const dispatch = useDispatch()
  const lazyUpdate = useMemo(
    () =>
      debounce((updatedNote: string) => {
        dispatch(
          updateNote({
            id,
            value: updatedNote,
          })
        )
      }, 314),
    [id, dispatch]
  )
  const turnOffLive = () =>
    dispatch(
      setLiveNoteStatus({
        id: 'dummy-id',
        value: false,
      })
    )

  return (
    <BackupEditor
      id={id}
      readOnly={readOnly}
      note={note}
      onChange={lazyUpdate}
      turnOffLive={turnOffLive}
    >
      <NoteWrapper
        id={id}
        readOnly={readOnly}
        note={note}
        lazyUpdate={lazyUpdate}
      />
    </BackupEditor>
  )
}

export default ResilientLiveNote
