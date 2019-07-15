import React from 'react'
import { connect } from 'dva'
import Modal from './Modal'
import { DataTable, Page } from '../../../components'
import { Button, Input } from 'antd'

const Item = ({ dispatch, items, loading }) => {
  const { list, total, currentItem, modalVisible, mode } = items

  const domain = 'items'
  const domainCN = '商品目录信息'

  const modalProps = {
    dispatch,
    loading,
    mode,
    domain,
    record: currentItem,
    visible: modalVisible,
    maskClosable: false,
    width: '60%',
    confirmLoading: mode === 'create' ? loading.effects[`${domain}/create`] : loading.effects[`${domain}/update`],
    readOnly: mode === 'view',
    title: mode === 'create' ? `新增${domainCN}` : mode === 'update' ? `修改${domainCN}` : `查看${domainCN}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: `${domain}/${mode}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: `${domain}/hideModal`,
      })
    },
  }

  const handleExport = () => {
    dispatch({
      type: `${domain}/exportFile`,
    })
  }

  const tableProps = {
    domain,
    dispatch,
    loading,
    total,
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
    customBtn: <Button icon="cloud-download" type="primary" onClick={handleExport}
      style={{ marginRight: 6 }}>批量导出</Button>,
    onFilterChange: (data) => {
      dispatch({
        type: `${domain}/onFilterChange`,
        payload: data,
      })
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

  return (
    <Page inner>
      <DataTable {...tableProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

export default connect(({ items, loading }) => ({ items, loading }))(Item)
