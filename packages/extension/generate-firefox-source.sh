#! /bin/sh

# Installation Steps:
#  - `pnpm install` (or `pnpm install`). This step will install all necessary dependencies. pnpm v8 is used for this project.
# 
# Build steps:
#  - `pnpm build:firefox`. 
# 
#  This pnpm task will build the final archive from source. The location of final archive is `release/firefox`. The zip file is the final file uploaded to add-on store. Rest of the files are the contents of the zip file.
# 
#  Environment Info:
#   - bun `v1.1.3`
#   - node `v20.x`
#   - npm `v10.x` / pnpm 8.x
#   - OS `Mac OS 12.6.3`

tar -cvzf ~/Desktop/remindoro-firefox-source.tar.gz package.json tsconfig.json pnpm-lock.yaml src/
