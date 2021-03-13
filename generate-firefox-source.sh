# Installation Steps:
#  - `yarn` (or `yarn install`). This step will install all necessary dependencies
# 
# Build steps:
# use `nvm use` to switch to recommended node version
#  - `gulp build-firefox-remindoro`. 
# 
#  This gulp task will build the final archive from source. The location of final archive is `dist/firefox`. The zip file is the final file uploaded to add-on store. Rest of the files are the contents of the zip file.
# 
#  Environment Info:
#   - node `v10.15.2`
#   - npm `v6.4.1`
#   - OS `Mac OS 10.14.2`

tar --exclude='./node_modules' --exclude='./build' --exclude='./dist' --exclude='./docs' --exclude='.git' -cvzf ~/Desktop/remindoro-firefox-source.tar.gz .
