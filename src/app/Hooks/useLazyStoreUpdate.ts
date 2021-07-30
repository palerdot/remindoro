import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { debounce } from 'lodash'

import type { ActionCreatorWithPayload } from '@reduxjs/toolkit'

const STORE_UPDATE_DELAY = 3140

type Props<T> = {
  id: string
  // we don't know what the value could be
  payload: T
  // store dispatch function;
  updater: ActionCreatorWithPayload<{
    id: string
    value: T
  }>
}

function useLazyStoreUpdate<T>({ id, payload, updater }: Props<T>) {
  const dispatch = useDispatch()
  const [value, setValue] = useState<T>(payload)

  const lazyUpdate = useCallback(
    debounce(
      updatedValue =>
        dispatch(
          updater({
            id,
            value: updatedValue,
          })
        ),
      STORE_UPDATE_DELAY
    ),
    []
  )

  useEffect(() => {
    console.log('porumai ... local value updated ', value)
    // update store(lazily)
    lazyUpdate(value)
  }, [value])

  return {
    value,
    setValue,
  }
}

export default useLazyStoreUpdate
