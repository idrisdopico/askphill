#/bin/env bash
set -o errexit # Exit on error

source ~/.profile

rvm use ruby-2.3.0

nvm use 5.10
npm config set cache $NPM_CACHE


# Frontend install
echo "> Installing dependencies"
npm install
bundle install --jobs 4 --deployment

echo "> Compiling assets"
npm run build

echo "> Compile website"
middleman build

# Archiving
# Make dist dir just in case its first time
cd ../

# Clean and Compress

rm -Rf workspace
ln -s "$BASE_JOB_NAME"/ workspace
mkdir -p workspace/dist
rm -f workspace/dist/$ARCHIVE_PREFIX-*.$ARCHIVE_EXT

echo "Will run command: tar -hIlbzip2 -cf $ARCHIVE_FULL $ARCHIVE_EXCLUDE"
tar -hIlbzip2 -cf $ARCHIVE_FULL $ARCHIVE_EXCLUDE
mv $ARCHIVE_FULL workspace/dist/$ARCHIVE_FULL
echo "=> Created archive $ARCHIVE"
