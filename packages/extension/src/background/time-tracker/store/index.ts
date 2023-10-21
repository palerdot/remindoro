import { createStore } from 'tinybase'
import {
  createIndexedDbPersister,
  IndexedDbPersister,
} from 'tinybase/persisters/persister-indexed-db'

// indexed db key for storing time tracking related key/values and tables
const STORE_KEY = 'time_tracker_store'

// Key/Values
const ACTIVE_TAB_URL = 'active_tab_url'

// TABLES
const WEB_SESSIONS_TABLE = 'web_sessions'

type TablesData = {
  [key in typeof WEB_SESSIONS_TABLE]?: typeof WEB_SESSIONS_TABLE
}
type ValuesData = {
  [key in typeof ACTIVE_TAB_URL]?: typeof ACTIVE_TAB_URL
}

type StoreContent = [TablesData, ValuesData]

export async function getStore() {
  const store = createStore()
  const persistor = createIndexedDbPersister(store, STORE_KEY)

  // loads data from indexeddb storate into store instance
  await persistor.load()

  return { store, persistor }
}

// helper function to persist store data to storage(indexeddb) and free up the object
export async function saveAndExit(persistor: IndexedDbPersister) {
  await persistor.save()
  // destroy instance for garbage collection
  persistor.destroy()
}

export async function getStoreContent(): Promise<StoreContent> {
  const { store, persistor } = await getStore()
  persistor.destroy()
  return store.getContent()
}

// -------------------------------------------------------------------
// Main function that tracks web session - start session/end session
export async function updateWebSession(current_active_url: string) {
  // get store data
  const { store, persistor } = await getStore()
  // get active tab url from store
  const previous_active_tab_url = store.getValue(ACTIVE_TAB_URL)
  // check if current active url is same is existing active tab url
  // if same do not do anything
  if (previous_active_tab_url === current_active_url) {
    return
  }
  // we have a new active url
  // CASE 0:
  // let previous_active_tab_url = store.get('active_tab_url')
  // update active tab url
  store.setValue(ACTIVE_TAB_URL, current_active_url)
  await saveAndExit(persistor)

  // if not we have two things to do
  // CASE 1:
  // If current active url has to be tracked, create a new web session entry
  // with last_heartbeat_check set to now
  // 2 - If previous active url has to be tracked, we have to end the session
  // CASE 2: End previous active url session
  // find the active session for previous active url - has_ended not set, ended_at time not set, url has to match previous active url
  // if multiple sessions are present, pick the first one and mark as ended
}
