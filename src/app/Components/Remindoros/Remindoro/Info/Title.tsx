import React from 'react'

import { updateTitle } from '@app/Store/Slices/Remindoros'
import { useLazyStoreUpdate } from '@app/Hooks/'

type Props = {
  id: string
  title: string
}

function Title({ id, title }: Props) {
  const { value, setValue } = useLazyStoreUpdate<string>({
    id,
    payload: title,
    updater: updateTitle,
  })

  return (
    <input
      type="text"
      placeholder={'Add Title'}
      value={value}
      onChange={e => {
        setValue(e.target.value)
      }}
    />
  )
}

export default Title
