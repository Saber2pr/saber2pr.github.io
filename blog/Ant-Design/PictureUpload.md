Front-end file upload I suggest to use cors direct transmission, do not go to the agent to forward, because the file stream forwarding node is more troublesome.
The antd Upload component sends the file according to the api you provide, and then provides a callback function that returns the result. You send the returned result into onChange and submit it to the form for submission.
```tsx
import './style.less'

import { Avatar, Input, message, Upload } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile, UploadProps } from 'antd/lib/upload/interface'
import classnames from 'classnames'
import React, { useEffect, useState } from 'react'

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

import { Link } from '../link'

export interface ImgUpload {
  className?: string
  action?: string
  value?: string
  onChange?: (value: string) => void
  multiple?: boolean
  size?: [number, number]
}

function beforeUpload(file: File) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式图片!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小必须小于 2MB!')
  }
  return isJpgOrPng && isLt2M
}

export const ImgUpload = ({
  className,
  action,
  value,
  onChange,
  multiple = false,
  size,
}: ImgUpload) => {
  const [loading, setLoading] = useState(false)
  const [imgUrl, setImgUrl] = useState<string>(value)

  useEffect(() => {
    setImgUrl(value)
  }, [value])

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    console.log('up-info', info)
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setLoading(false)
      const imageUrl = info?.file?.response?.url
      setImgUrl(imageUrl)
      onChange && onChange(imageUrl)
    }
  }

  const uploadProps: UploadProps = {
    action,
    multiple,
    beforeUpload,
    onChange: handleChange,
  }

  return (
    <Upload
      listType="picture-card"
      showUploadList={false}
      className={classnames('ImgUpload', className)}
      {...uploadProps}
    >
      {imgUrl ? (
        <Avatar className="uploadedImg" shape="square" src={imgUrl} />
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>上传图片</div>
          {size && (
            <div style={{ marginTop: 4 }}>
              ({size[0]}x{size[1]})
            </div>
          )}
        </div>
      )}
    </Upload>
  )
}

export const ImgUploadOrAdd = ({ value, onChange, ...props }: ImgUpload) => {
  const [useUrl, setUseUrl] = useState(false)

  let content = <></>
  if (useUrl) {
    content = (
      <Input
        placeholder="请输入图片url地址"
        value={value}
        onChange={e => onChange(e?.target?.value)}
      />
    )
  } else {
    content = <ImgUpload {...props} value={value} onChange={onChange} />
  }

  return (
    <div className="ImgUploadOrAdd">
      {content}
      <Link className="change" onClick={() => setUseUrl(!useUrl)}>
        {useUrl ? '没有url？上传图片' : '设置已有图片url'}
      </Link>
    </div>
  )
}
```
```css
.ImgUpload {
  .uploadedImg {
    display: block;
    width: 100%;
    height: 100%;
    img {
      object-fit: contain;
    }
  }
}

.ImgUploadOrAdd {
  .ant-upload-picture-card-wrapper {
    width: auto;
    .ant-upload-select {
      margin: 0;
    }
  }
  .change {
    text-decoration: underline;
    vertical-align: bottom;
    margin-left: 16px;
  }
}
```