import React from 'react'
import { Button, Form, Modal } from 'antd'

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
      <img alt="example" style={{ width: '100%' }} src={`data:image/jpg;base64,${record.imageStr}`} />
    </Modal>
  )
}

export default Form.create()(modal)
