1. TSC_COMPILE_ON_ERROR

可以跳过typescript类型检查强制打包

```json
{
  "scripts": {
    "build": "TSC_COMPILE_ON_ERROR=true react-scripts build",
  },
}
```

2. PUBLIC_URL

publicPath

```json
{
  "scripts": {
    "build": "PUBLIC_URL=/my-app react-scripts build",
  },
}
```
