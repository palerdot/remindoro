## Changelog

### `1.7.4`

- Chrome Release

### `1.7.3`

- Better whats new modal on info icon click

### `1.7.2`

- compile time environment variables for development/production

### `1.7.1`

- Bun bundler
- Home screen configuration

### `1.6.3`

- Fixes for active tab detection

### `1.6.2`

- Better extension id generation flow
- Show/Hide tab focus events

### `1.6.1`

- Firefox manifest v3
- Better streaming site/background tab time tracking

### `1.6.0`

- Experimental: Settings for time tracking streaming site
- Extension id in account screen

### `1.5.0`

- `Browser Time Tracker`

---------------------

### `1.2.3`
- Common `setBadgeText` util for chrome(`browser.action (v3 confusions!!!)`)/firefox(`browser.browserAction`)
- Better chrome/firefox detection


###  `1.2.2`
- Style tweaks

### `1.2.1`
- `Bug Fix`: Fix stale local data reset from the closure data passed to alarm callback

### `1.2.0` (`Lexical/Todo notes`)
- Todo notes
- Lexical powered `react-slite` `v0.2.x`

### `1.1.1` (Chrome only)

- Remove `tabs` permission from Chrome Manifest. Google sent an email notice that tabs permission
is not used and had to be removed.


### `1.1.0`
- Day Theme
- In-Extension Feedback
- New public site (https://remindoro.app)

### `1.0.6` 
- Better Thematic break handling (`react-slate v0.1.5`)

### `1.0.5` (`Firefox only`)
- Fixes https://github.com/palerdot/remindoro/issues/36
- Vitest
- Thematic break from `react-slite v0.1.x`
- Rich text improvements from `react-slite v0.1.x`

### `1.0.4` (React Slite/Better markdown editing `No War/Save Ukraine version`)
- `react-slite` for better markdown editing

### `1.0.3`  (Chrome/ Migration fix)
- Option for user to fix the data in chrome (since chrome bug prevented data migration). The option is shown in the footer where the user can fix the data. Once the data is fixed the option will not be shown again. Commits (in case we don't want this anymore we can revert these commits) - `d05637e65dcaec9a0feeed001b3b2ef4426b6c2d`, `a4a9ba7fceb43412c1d9621c502f59658a41015d`, `10ec030e4ae0da8827fe963b9d12ce468d2299c2`, `d36eec7719bf9db64944bc69f3ff0b4911d4649c`.


### `1.0.2` (Manifest fix)

-  Removed `clipboard` related permissions
-  Splash screen
-  Help text fix


### `1.0.1` (Chrome Beta)

- `Chrome v1.x`. `Manifest v3`
- `webextension-polyfill` upgrade to `0.8.0` (and `@types/webextension-polyfill`)
- Chrome notification fix: unique uuid for every notification
- Font fixes.

### `1.0.0` (`Diwali Special`, Firefox Beta)

- New revamped `v1.x` codebase for `Firefox`. Rebuilt with `React 17.x (hooks)`, `Typescript`, `styled-components`, `MUI`, `redux toolkit` and friends
- Experimental `Rich Text Editor` (similar to slack) for note.
- Improved UX with dedicated settings. 
- Pause/resume notifications. 

and more ...

-----------------------------------------------------------------------------------

### 0.3.0
- `Firefox/Chrome`: fix overflow issue
- Better instructions for setting up old dev environment

### 0.2.3

##### Firefox:
- **activeTab** permission to fix 'Save Text to Remindoro' and 'Add Page to Remindoro'

##### Chrome and Firefox:
- Fixing html tags shown in notification title and note

### 0.2
Support for both **Chrome** and **Firefox**

********

### 0.1

Chrome only
