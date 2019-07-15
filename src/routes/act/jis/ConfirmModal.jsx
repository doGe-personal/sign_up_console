import React from 'react'
import { Button,Table,Modal } from 'antd'
const modal = ({
  list,
  onClose,
  dispatch,
  loading,
  ...modalProps
}) => {
  
  const handleClose= () => {
    onClose()
  }

  const modalOpts = {
    ...modalProps,
    onCancel: handleClose,
    footer: [
      <Button key="back" onClick={handleClose}>
        关闭
      </Button>,
    ],
  }

  const tableProps = {
    dataSource: list,
    columns: [
      {
        title: '活动名称',
        dataIndex: 'actTitle',
      },
      {
        title: '参与人',
        dataIndex: 'custName',
      },
      {
        title: '参与手机',
        dataIndex: 'custMobile',
      },{
        title: '未通过原因',
        dataIndex: 'noPassReason',
      },
    ],
  }

  return (
    <Modal {...modalOpts}>
      <Table {...tableProps} /> 
    </Modal>
  )
}

export default modal
