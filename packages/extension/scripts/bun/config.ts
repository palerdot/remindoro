const CHROME_CONFIG = {
  rate_url:
    'https://chrome.google.com/webstore/detail/remindoro/njmniggbfobokemdjebnhmbldimkofkc/reviews',
}

const FIREFOX_CONFIG = {
  rate_url: 'https://addons.mozilla.org/en-GB/firefox/addon/remindoro/',
}

export function get_browser_config(browser: string) {
  if (browser === 'firefox') {
    return FIREFOX_CONFIG
  }

  return CHROME_CONFIG
}

// development/production config

const DEVELOPMENT_CONFIG = {
  API_URL: 'http://localhost:4000',
}

const PROD_CONFIG = {
  API_URL: 'https://remindoro.app',
}

export function get_runtime_config() {
  if (process.env.NODE_ENV === 'production') {
    return PROD_CONFIG
  }

  return DEVELOPMENT_CONFIG
}
