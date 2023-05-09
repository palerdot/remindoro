#! /bin/sh

# Installation Steps:
#  - `yarn` (or `yarn install`). This step will install all necessary dependencies. Yarn v1 is used for this project.
# 
# Build steps:
#  - `yarn build:firefox`. 
# 
#  This yarn task will build the final archive from source. The location of final archive is `release/firefox`. The zip file is the final file uploaded to add-on store. Rest of the files are the contents of the zip file.
# 
#  Environment Info:
#   - node `v16.x`
#   - npm `v8.x` / yarn `v1.22.x`
#   - OS `Mac OS 12.6.3`

tar -cvzf ~/Desktop/remindoro-firefox-source.tar.gz package.json tsconfig.json yarn.lock src/