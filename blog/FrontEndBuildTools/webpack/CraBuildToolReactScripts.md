1. TSC_COMPILE_ON_ERROR
You can skip typescript type checking to force packaging
```json
{
  "scripts": {
    "build": "TSC_COMPILE_ON_ERROR=true react-scripts build",
  },
}
```
2. PUBLIC_URL
PublicPath
```json
{
  "scripts": {
    "build": "PUBLIC_URL=/my-app react-scripts build",
  },
}
```