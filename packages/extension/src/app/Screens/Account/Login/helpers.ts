import { postData } from '@app/Util/config'
import type { ApiResponse } from '@app/Util/config'
import type { AccountInfo } from '@app/Store/Slices/Account'

export async function loginUser(payload: {
  email: string
  extension_id: string
  extension_key: string
}): Promise<ApiResponse<AccountInfo>> {
  const response = await postData('/api_bext/pairing_details', payload)
  // make an api call to 'API_URL/api_bext/pairing_details'
  // fetch the user details from the server

  if (!response.ok) {
    const resp = await response.json()
    return {
      success: false,
      error: `${resp}`,
      status: response.status,
      statusText: response.statusText,
    }
  }

  const data = await response.json()

  return {
    success: true,
    data,
  }
}
