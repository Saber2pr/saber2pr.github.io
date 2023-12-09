## 基础篇

### echo 打印输出

```bash
echo 'helloworld'
```

### read 获取用户输入

```bash
echo '请输入：'
read name
echo '你输入的是：' $name
```

### ls 列出目录

```bash
ls
```

### cat 查看文件内容

```bash
cat package.json
```

### touch 创建文件

```bash
touch test.sh
```

### echo 写入文件

```bash
echo test > test.sh
```

### rm 删除文件

```bash
rm test.sh
```

### cd 进入目录

```bash
cd src
```

返回上一层

```bash
cd ..
```

### 重命名文件

```bash
mv name1 name2
```

### 取得文件夹所有权

```bash
sudo chmod -R 777 .
```

## 应用篇

### 一键清理<none>镜像
  
```bash
docker rmi $(docker images | grep "<none>" | grep -oE "[0-9a-z]{12}" | tr '\n' ' ')
```
  
说明：docker images列出镜像，grep none过滤出none镜像的行，然后正则提取镜像id，用tr命令将每一行组合到一行上空格分隔，最后使用rmi命令删除过滤好的none镜像id
  
### 实时查看文件日志
  
```bash
tail -f -n 10 logs/nest:09-16.log
```

### 查看yarn.lock中某个库的版本

```bash
cat yarn.lock | grep -oE -A1 "^react@\S+"  
```
  
说明：cat <file> 可以将文件内容输出到终端，grep可以对终端内容的每一行进行筛选，-o表示只输出匹配到的内容，-E表示使用扩展正则，-A表示输出内容包含往后几行例如A1将包含往后1行。

### 校验参数

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

### 条件语句

多行：
  
```sh
if [[ "$entry" = "123" ]]; then
  echo $entry
else
  echo "test"
  exit
fi
```

单行：

```sh
# exit 0 正常退出，exit 1 异常退出
[[ {{ .beta }} == true ]] && echo "skip register entry in beta." && exit 0
```
  
### 列出文件夹
  
```sh
ls -d */
```
  
### grep过滤行

-v 反选
  
```sh
ls -d */ | grep -v "blog" # 排除含有blog的
```
  
### 管道cp
  
```sh
ls -d */ | grep -v "blog" | xargs -I {} cp -r ./{} ./blog/{} 
```

`xargs -I {}`声明一个占位符号{}接收前面的值，后面的命令替换符号
  
### 删除非某个类型的文件
  
```sh
find ./blog -type f -not -name "*.md" | xargs -I {} rm -rf {}
```
  
### 删除空目录
  
```sh
find ./blog -type d -empty | xargs -n 1 rm -rf
```
  
### 取每行的几个字符
  
```sh
find . | awk '{print substr($0, 3)}' # 取每行第3个字符后的
```
  
### 判断文件内是否有指定内容
  
```sh
[[ $(grep -c build ./package.json) != 0 ]] && yarn run build
```
  
### 删除目录下所有文件（包括隐藏文件）
```sh
ls -A1 | xargs rm -rf
```
