import React from 'react'
import { connect } from 'dva'
import Modal from './Modal'
import QualifyModal from './QualifyModal'
import ViewModal from './ViewModal'
import { DataTable, Page } from '../../../components'
import { Button, Input, Popconfirm, Switch } from 'antd'


const Customer = ({ dispatch, custs, loading }) => {
  const { list, total, currentItem, modalVisible, mode, qualifyVlsible, qualifyModal, viewModalVisble, qualify, editQulVisble } = custs

  const domain = 'custs'
  const domainCN = '客户信息'

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
    onUploadQualify(data) {
      dispatch({
        type: `${domain}/uploadQualify`,
        payload: data,
      })
    },
    handleShowImg(imgStr) {
      console.log(imgStr)
      dispatch({
        type: `${domain}/handleShowImg`,
        payload: imgStr,
      })
    },
  }

  const qualifyModalProps = {
    dispatch,
    loading,
    mode: qualifyModal,
    domain,
    editQulVisble: editQulVisble,
    record: qualify,
    visible: qualifyVlsible,
    maskClosable: false,
    width: '60%',
    confirmLoading: mode === 'create' ? loading.effects[`${domain}/create`] : loading.effects[`${domain}/update`],
    readOnly: mode === 'view',
    title: '证件识别信息',
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: `${domain}/qualifyUpdate`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: `${domain}/hideModal`,
      })
    },
    onEdit() {
      dispatch({
        type: `${domain}/onEdit`,
      })
    },
  }

  const viewModalProps = {
    dispatch,
    loading,
    domain,
    editQulVisble: editQulVisble,
    record: qualify,
    visible: viewModalVisble,
    maskClosable: false,
    width: '60%',
    title: '证件照片',
    onCancel() {
      dispatch({
        type: `${domain}/hideViewModal`,
      })
    },
  }

  const handleEnableCustomer = (record) => {
    dispatch({
      type: `${domain}/exchangStatus`,
      payload: record,
    })
  }

  const handleSelectQulify = (record) => {
    dispatch({
      type: `${domain}/callQualifyModal`,
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
    showAdd: false,
    showDelete: false,
    customBtn: <Button icon="cloud-download" type="primary" onClick={handleExport}
      style={{ marginRight: 6 }}>批量导出</Button>,
    onFilterChange: (data) => {
      dispatch({
        type: `${domain}/onFilterChange`,
        payload: data,
      })
    },
    filter: [
      {
        title: '客户姓名',
        dataIndex: 'custName',
        tag: <Input />,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        tag: <Input />,
      },
    ],
    columns: [
      {
        title: '客户编码',
        dataIndex: 'custCode',
      },
      {
        title: '客户姓名',
        dataIndex: 'custName',
      },
      {
        title: '性别',
        dataIndex: 'sexName',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        title: '车牌号',
        dataIndex: 'plateNo',
      },
      {
        title: '行驶证注册日期',
        dataIndex: 'regTime',
      }, {
        title: '行驶证发证日期',
        dataIndex: 'licTime',
      }, {
        title: '证件识别信息',
        dataIndex: 'empCode',
        render: (value, record, index) => (
          <Button disabled={!record.licenseId} size={'small'} icon="solution"
            onClick={handleSelectQulify.bind(this, record)} />
        ),
      }, {
        title: '操作',
        dataIndex: '',
        render: (value, record, index) => (
          <div>
            <Popconfirm
              title="确定要更改吗？"
              okText="是"
              cancelText="否"
              onConfirm={handleEnableCustomer.bind(this, record)}
            >
              <Switch
                size="small"
                checked={!!record.enableFlag}
              />
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
      {qualifyVlsible && <QualifyModal {...qualifyModalProps} />}
      {viewModalVisble && <ViewModal {...viewModalProps} />}
    </Page>
  )
}

export default connect(({ custs, loading }) => ({ custs, loading }))(Customer)
