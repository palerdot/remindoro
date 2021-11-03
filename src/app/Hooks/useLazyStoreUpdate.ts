import { useState, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { debounce } from '@lodash'

import type { ActionCreatorWithPayload } from '@reduxjs/toolkit'

const STORE_UPDATE_DELAY = 314

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

  const lazyUpdate = useMemo(
    () =>
      debounce(
        (updatedValue: T) =>
          dispatch(
            updater({
              id,
              value: updatedValue,
            })
          ),
        STORE_UPDATE_DELAY
      ),
    [id, dispatch, updater]
  )

  // eventual update of value
  useEffect(() => {
    setValue(currentValue => {
      return payload === currentValue ? currentValue : payload
    })
  }, [payload])

  useEffect(() => {
    // update store(lazily)
    lazyUpdate(value)
  }, [value, lazyUpdate])

  return {
    value,
    setValue,
  }
}

export default useLazyStoreUpdate
