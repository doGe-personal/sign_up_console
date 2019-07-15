import React from 'react'
import { Button, Col, Input, Modal } from 'antd'

const { TextArea } = Input

const modal = ({
  mode,
  domain,
  onOk,
  onCancel,
  dispatch,
  loading,
  handleInputNu,
  ...modalProps
}) => {
  const modalOpts = {
    onCancel: onCancel,
    ...modalProps,
    footer: [
      <Button key="back" onClick={onCancel}>
        取消
      </Button>,
      mode !== 'view' && (
        <Button
          key="submit"
          type="primary"
          onClick={onOk}
        >
          确定
        </Button>
      ),
    ],
  }

  return (
    <Modal {...modalOpts} >
      <Col style={{ marginTop: 15 }}>
        <TextArea placeholder={'请输入商品唯一编码: 如1001001,1001002,1001003...'} onChange={handleInputNu}
          autosize={{ minRows: 4 }} size="large" />
      </Col>
    </Modal>
  )
}

export default modal
