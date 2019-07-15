import React from 'react'
import { connect } from 'dva'
import Modal from './Modal'
import { Button, Popconfirm } from 'antd'
import { DataTable, Page, UdcSelect } from '../../../components'

const Ous = ({ dispatch, ous, loading }) => {
  const { list, total, currentItem, modalVisible, mode, ouType } = ous

  const domain = 'ous'
  const domainCN = '门店信息'

  const modalProps = {
    dispatch,
    loading,
    mode,
    domain,
    ouType,
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
    onOuChange(value) {
      dispatch({
        type: `${domain}/updateState`,
        payload: { ouType: value },
      })
    },
  }

  const handleRefreshPass = record => {
    dispatch({
      type: `${domain}/refreshPass`,
      payload: record,
    })
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
    customBtn: <Button icon="cloud-download" type="primary" onClick={handleExport}
      style={{ marginRight: 6 }}>批量导出</Button>,
    onFilterChange: (formFields) => {
      dispatch({
        type: `${domain}/onChangeOu`,
        payload: formFields,
      })
    },
    filter: [
      {
        title: '类型',
        dataIndex: 'ouType',
        options: {
          rules: [
            {
              required: false,
              message: '必填',
            },
          ],
          initialValue: '1',
        },
        tag: <UdcSelect domain="ous" code="ou_type" onChange={() => {
          console.log('outer')
        }} />,
      },
    ],
    columns: [
      {
        title: '类型',
        dataIndex: 'ouTypeName',
      },
      {
        title: '经销商编码',
        dataIndex: 'orgCode',
      },
      {
        title: '所属经销商',
        dataIndex: 'orgName',
      },
      {
        title: '编码',
        dataIndex: 'ouCode',
      },
      {
        title: '名称',
        dataIndex: 'ouName',
      }, {
        title: '省',
        dataIndex: 'province',
      },
      {
        title: '市',
        dataIndex: 'city',
      },
      {
        title: '密码',
        dataIndex: 'ouPass',
      }, {
        title: '门店电话',
        dataIndex: 'mobile',
      }, {
        title: '重置密码',
        dataIndex: '',
        render: (value, record, index) => (
          <div>
            <Popconfirm
              title="确定要重置吗？"
              okText="是"
              cancelText="否"
              onConfirm={handleRefreshPass.bind(this, record)}
            >
              <Button type="danger" shape="circle" icon="sync"></Button>
            </Popconfirm>
          </div>
        ),
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

export default connect(({ ous, loading }) => ({ ous, loading }))(Ous)
