import React from 'react'
import styled from 'styled-components'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import Switch from '@app/Components/Switch'
import { useLazyStoreUpdate } from '@app/Hooks/'
import { updateTodo } from '@app/Store/Slices/Remindoros/'

type Props = {
  id: Remindoro['id']
  isTodo: Remindoro['isTodo']
}

const Holder = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;
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

function MarkTodo({ id, isTodo }: Props) {
  const { value, setValue } = useLazyStoreUpdate({
    id,
    payload: isTodo,
    updater: updateTodo,
  })

  return (
    <Holder>
      <Row>
        <div className={'first-col'}>
          <Switch
            checked={!!value}
            setChecked={status => {
              setValue(status)
            }}
            ariaLabel={'Mark Todo'}
          />
        </div>
        <div className={'second-col'}>{'Mark as Todo'}</div>
      </Row>
    </Holder>
  )
}

export default MarkTodo
