#! /bin/sh

# Installation Steps:
#  - `yarn` (or `yarn install`). This step will install all necessary dependencies
# 
# Build steps:
#  - `yarn build:firefox`. 
# 
#  This yarn task will build the final archive from source. The location of final archive is `release/firefox`. The zip file is the final file uploaded to add-on store. Rest of the files are the contents of the zip file.
# 
#  Environment Info:
#   - node `v16.x`
#   - npm `v8.x` / pnpm `v8.x`
#   - OS `Mac OS 12.6.3`

# tar --exclude='./node_modules' --exclude='./screenshots' --exclude='./release' --exclude='./dev-server'  --exclude='./build' --exclude='./dist' --exclude='./docs' --exclude='.git' -cvzf ~/Desktop/remindoro-firefox-source.tar.gz .

tar -cvzf ~/Desktop/remindoro-firefox-source.tar.gz package.json tsconfig.json yarn.lock src/