## Basic part
### Echo printout
```bash
echo 'helloworld'
```
### read Get user input
```bash
echo '请输入：'
read name
echo '你输入的是：' $name
```
### Ls lists catalogs
```bash
ls
```
### cat View file contents
```bash
cat package.json
```
### Touch create File
```bash
touch test.sh
```
### Echo writes to a file
```bash
echo test > test.sh
```
### rm delete file
```bash
rm test.sh
```
### Cd enters the directory
```bash
cd src
```
Return to the upper floor
```bash
cd ..
```
### Rename a file
```bash
mv name1 name2
```
### Take ownership of the folder
```bash
sudo chmod -R 777 .
```
## Application chapter
### One click to clean < none > image

```bash
docker rmi $(docker images | grep "<none>" | grep -oE "[0-9a-z]{12}" | tr '\n' ' ')
```
  
Description: docker images lists the images, grep none filters out the rows of the none images, then regularly extracts the image id, combines each line into a line with the tr command to separate spaces, and finally uses the rmi command to delete the filtered none image id
  
### View file logs in real time

```bash
tail -f -n 10 logs/nest:09-16.log
```
### View the version of a library in yarn.lock
```bash
cat yarn.lock | grep -oE -A1 "^react@\S+"  
```

Note: cat < file > can output the file content to the terminal, grep can filter each line of the terminal content,-o means only output matching content,-E means using extended regular,-A means that the output contains the next few lines, for example, A1 will contain the next line.
### verification parameter
```sh
function verify_arg {
  if [ "$2" = "" ]; then
    echo "$1 is required: $2"
    exit
  else
    echo $2
  fi
}
  
verify_arg "entry" $entry
```
### Conditional statement
Multiple lines:

```sh
if [[ "$entry" = "123" ]]; then
  echo $entry
else
  echo "test"
  exit
fi
```
Single line:
```sh
# exit 0 正常退出，exit 1 异常退出
[[ {{ .beta }} == true ]] && echo "skip register entry in beta." && exit 0
```

### List folders
  
```sh
ls -d */
```

### Grep filter rows
-v reverse election

```sh
ls -d */ | grep -v "blog" # 排除含有blog的
```

### Pipeline cp

```sh
ls -d */ | grep -v "blog" | xargs -I {} cp -r ./{} ./blog/{} 
```
`placeholder {} `declares a placeholder {} to receive the previous value, followed by a command to replace the symbol

### Delete files that are not of a certain type

```sh
find ./blog -type f -not -name "*.md" | xargs -I {} rm -rf {}
```

### Delete empty directory

```sh
find ./blog -type d -empty | xargs -n 1 rm -rf
```
  
### Take a few characters from each line

```sh
find . | awk '{print substr($0, 3)}' # 取每行第3个字符后的
```
  
### Determine whether there is a specified content in the file

```sh
[[ $(grep -c build ./package.json) != 0 ]] && yarn run build
```

### Delete all files in the directory (including hidden files)
```sh
ls -A1 | xargs rm -rf
```