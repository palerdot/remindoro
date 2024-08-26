import { v4 as uuid } from 'uuid'
import { createSlice } from '@reduxjs/toolkit'

export const STUB_EID = 'NO-EXTENSION-ID-GENERATED'

export interface AccountState {
  extension_id?: string
  // account details from server
  info?: AccountInfo
  // when was last synced with server
  last_server_sync_time?: string
}

const initialState: AccountState = {}

// account details
export type AccountInfo = {
  user: UserInfo
  extension: ExtensionInfo
}

// user details
type UserInfo = {
  id: number | string
  email: string
  name: string | null
  payment_plan: string
  payment_plan_expiry_at?: string
}

// extension details
type ExtensionInfo = {
  key: KeyInfo
  pairing: PairingInfo
}

// key details
type KeyInfo = {
  id: string | number
  active: boolean
  status: string
  // biome-ignore lint: for now let us keep this any object
  permissions: {}
  activated_at: string | null
  deactivated_at: string | null
}

// pairing details
type PairingInfo = {
  extension_id: string
  active: boolean
  status: string
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
