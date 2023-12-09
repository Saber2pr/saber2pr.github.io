```sh
if [ "$1" = "" ]; then
  echo "The Git repository URL is required"
  exit
fi

if [ "$2" = "" ]; then
  echo "You need to specify the path to clone"
  exit
fi

git clone --depth 1 $1 $2 \
&& cd $2 \
&& FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --prune-empty --subdirectory-filter $2 HEAD
```
