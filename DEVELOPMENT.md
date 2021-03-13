## Development instructions

- `node 10.x (lts/dubnium)` is the working version for this setup
- `nvm use` in the root to switch to this node version

### Development

#### Firefox

- `yarn debug:firefox` will run gulp task (`gulp debug-firefox-remindoro`) and will build development version
- `yarn start:firefox` will run the extension locally using `webext`

#### Chrome

- `yarn debug:chrome` will run gulp task (`gulp debug-chrome-remindoro`) and will build th files
- `yarn start:chrome` will run the extension locally using `webext`

Packages to be pinned 
```
gulp => 3.9.x (4.0 has breaking changes) (`node-sass`, `gulp-sass` should be pinned to corresponding older versions)
webext => 5.x (6+ will work only with node 10+)
```

### Production Build

- `yarn build:firefox` will run gulp task (`gulp build-firefox-remindoro`) and will build production version

The final build will be based in `dist` folder
