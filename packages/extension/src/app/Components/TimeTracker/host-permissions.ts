import browser from 'webextension-polyfill'
import { isChrome } from '@background/utils'

// ref: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/request#examples
export async function requestPermissions(host: string): Promise<boolean> {
  // chrome needs 'tabs' permission explicitly to get the tab details like url
  // ref: https://developer.chrome.com/docs/extensions/reference/tabs/#perms

  const permissions: Array<any> = isChrome ? ['tabs'] : []

  const permissionsToRequest = {
    permissions,
    origins: [`https://*.${host}/*`, `http://*.${host}/*`],
  }

  return await browser.permissions.request(permissionsToRequest)
}
