### Development instructions

- `node 10.x (lts/dubnium)` is the working version for this setup
- `nvm use` in the root to switch to this node version

#### Building and running

- `yarn debug:firefox` will run gulp task (`gulp debug-firefox-remindoro`) and will build th files
- `yarn start:firefox` will run the extension locally using `webext`

Packages to be pinned 
```
gulp => 3.9.x (4.0 has breaking changes) (`node-sass`, `gulp-sass` should be pinned to corresponding older versions)
webext => 5.x (6+ will work only with node 10+)
```