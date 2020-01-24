yarn run build &&
yarn run update:static &&
git add . &&
git commit . -m 'build(*): update' &&
git push