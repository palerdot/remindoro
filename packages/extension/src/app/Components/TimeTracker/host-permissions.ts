import browser from 'webextension-polyfill'

// ref: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/request#examples
export async function requestPermissions(host: string): Promise<boolean> {
  const permissionsToRequest = {
    origins: [`https://*.${host}/*`, `http://*.${host}/*`],
  }

  return await browser.permissions.request(permissionsToRequest)
}
