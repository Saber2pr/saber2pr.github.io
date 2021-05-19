find ./ -name ".DS_Store" -depth -exec rm {} \;
yarn run update &&
git add . &&
git commit . -m 'feat(blog): update' &&
git push