import React from 'react'
import { Button, Form, Modal } from 'antd'
import { config } from '../../../utils'

const { api, baseURL } = config
const { ei } = api
const { imgDownload } = ei

const modal = ({
  mode,
  onOk,
  record,
  onCancel,
  dispatch,
  loading,
  previewImage,
  ...modalProps
}) => {
  const handleCancel = () => {
    onCancel()
  }

  const modalOpts = {
    ...modalProps,
    onCancel: handleCancel,
    footer: [
      <Button key="back" onClick={handleCancel}>
        关闭
      </Button>,
    ],
  }

  return (
    <Modal {...modalOpts}>
      <img alt="example" style={{ width: '100%' }} src={baseURL + '/' + imgDownload.replace('{file}', record.jidImg)} />
    </Modal>
  )
}

export default Form.create()(modal)
