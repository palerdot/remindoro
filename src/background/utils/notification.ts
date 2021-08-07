import { browser } from 'webextension-polyfill-ts'

// helper function to decide if we are dealing with firefox
// firefox does not allow adding action buttons like 'Close'
// const isFirefox = navigator.userAgent.indexOf('Firefox') > -1

export function notify({ title, note }: { title?: string; note?: string }) {
  browser.notifications
    .create('', {
      type: 'basic',
      iconUrl: '/images/icon-38.png',
      title: title || '',
      message: note || '',
    })
    .then(() => {
      // notification success callback
    })
    .catch(() => {
      // error showing notification
    })
}
