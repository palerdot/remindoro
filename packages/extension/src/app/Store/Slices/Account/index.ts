import { v4 as uuid } from 'uuid'
import { createSlice } from '@reduxjs/toolkit'

export const STUB_EID = 'NO-EXTENSION-ID-GENERATED'

export interface AccountState {
  extension_id?: string
  logged_in: boolean
  user?: UserInfo
}

const initialState: AccountState = {
  logged_in: false,
}

// account details
type UserInfo = {
  id: number | string
  email: string
  payment_plan: string
  payment_plan_expiry_at?: string
}

export function getExtensionId() {
  const id = uuid()
  const prefix = 'EID'

  return `${prefix}:${id}`
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    generateExtensionId: state => {
      // generate a new extension id
      state.extension_id = getExtensionId()
    },
  },
})

export const { generateExtensionId } = accountSlice.actions

export default accountSlice.reducer
