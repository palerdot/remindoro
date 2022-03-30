// helper module to get env specific config
interface Config {
  ApiUrl: string
  WebSocketUrl?: string
}

const DEV_CONFIG: Config = {
  ApiUrl: 'http://localhost:4000',
}

const PROD_CONFIG: Config = {
  ApiUrl: 'https://remindoro.app',
}

function getConfig(): Config {
  if (process.env.NODE_ENV === 'development') {
    return DEV_CONFIG
  }
  if (process.env.NODE_ENV === 'production') {
    return PROD_CONFIG
  }

  return DEV_CONFIG
}

// helper function to post json data
// ref: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options
export async function postData(path = '', data = {}) {
  const config = getConfig()
  // Default options are marked with *
  const response = await fetch(`${config.ApiUrl}${path}`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'manual', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response
}
