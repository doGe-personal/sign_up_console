import React from 'react'
import { Button, Form, Input, Modal } from 'antd'
import { DataTable } from '../../../components'

const modal = ({
  mode,
  domain,
  readOnly,
  record,
  onOk,
  onCancel,
  list,
  total,
  dispatch,
  loading,
  selectedRowKeys,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {


  const handleCancel = () => {
    onCancel()
  }

  const modalOpts = {
    onCancel: handleCancel,
    ...modalProps,
    footer: [
      <Button key="back" onClick={handleCancel}>
        取消
      </Button>,
      mode !== 'view' && (
        <Button
          key="submit"
          type="primary"
          onClick={onOk}
        >
          保存
        </Button>
      ),
    ],
  }

  const tableProps = {
    domain,
    dispatch,
    loading,
    total,
    showAdd: false,
    dataSource: list,
    rowKey: 'id',
    filter: [
      {
        title: '商品名称',
        dataIndex: 'itemName',
        tag: <Input />,
      },
      {
        title: '编码',
        dataIndex: 'itemCode',
        tag: <Input />,
      },
    ],
    onFilterChange: (data) => {
      console.log(data)
    },
    columns: [
      {
        title: '编码',
        dataIndex: 'itemCode',
      },
      {
        title: '商品名称',
        dataIndex: 'itemName',
      },
      {
        title: '品牌',
        dataIndex: 'itemBrand',
      },
      {
        title: '规格',
        dataIndex: 'itemSpec',
      },
      {
        title: '花纹',
        dataIndex: 'tyreTread',
      },
    ],
  }
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: 'actsItems/updateState',
        payload: {
          selectedRowKeys: selectedRowKeys,
          selectedRows: selectedRows,
        },
      })
    },
    getCheckboxProps: record => ({}),
  }

  return (
    <Modal {...modalOpts}>
      <DataTable rowSelection={rowSelection} {...tableProps} />
    </Modal>
  )
}

export default Form.create()(modal)
