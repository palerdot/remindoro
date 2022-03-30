## Changelog

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
