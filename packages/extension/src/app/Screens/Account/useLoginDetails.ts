import { useSelector } from 'react-redux'
import type { RootState } from '@app/Store/'
import type { AccountInfo } from '@app/Store/Slices/Account'

// NOTE: fetch account information from local storage (state.account.info)
// fetch information based on account.last_server_sync_time

export function useLoginDetails(): AccountInfo | null | undefined {
  const account = useSelector((state: RootState) => state.account)

  return account.info
}
