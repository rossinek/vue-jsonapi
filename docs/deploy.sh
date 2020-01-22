#!/usr/bin/env sh

# abort on errors
set -e

yarn run build
cd .vuepress/dist

git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:rossinek/vue-jsonapi.git master:gh-pages

cd -
