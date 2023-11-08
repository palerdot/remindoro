import { v4 as uuid } from 'uuid'
import { createSlice } from '@reduxjs/toolkit'

export interface AccountState {
  extension_id: string
}

const initialState: AccountState = {
  extension_id: getExtensionId(),
}

function getExtensionId() {
  const id = uuid()
  const prefix = 'EID'

  return `${prefix}:${id}`
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
})

export default accountSlice.reducer
