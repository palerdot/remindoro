const CHROME_CONFIG = {
  rate_url:
    'https://chrome.google.com/webstore/detail/remindoro/njmniggbfobokemdjebnhmbldimkofkc/reviews',
}

const FIREFOX_CONFIG = {
  rate_url: 'https://addons.mozilla.org/en-GB/firefox/addon/remindoro/',
}

export function get_config(browser: string) {
  if (browser === 'firefox') {
    return FIREFOX_CONFIG
  }

  return CHROME_CONFIG
}
