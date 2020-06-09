#!/bin/sh

cd `dirname $0`

rsync -a . release --exclude release --exclude .git --exclude README.md --exclude release.command
zip -r release.zip release
rm -rf release