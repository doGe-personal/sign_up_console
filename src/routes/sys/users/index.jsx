import React from 'react'
import { connect } from 'dva'
import Modal from './Modal'
import { DataTable, Page } from '../../../components'
import { Button, Input, Popconfirm, Switch, Tooltip } from 'antd'

const User = ({ dispatch, users, loading }) => {
  const { list, total, currentItem, modalVisible, mode } = users

  const domain = 'users'
  const domainCN = '用户'

  const handlePwdReset = record => {
    dispatch({
      type: `${domain}/resetPW`,
      payload: { id: record.id },
    })
  }

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

  const tableProps = {
    domain,
    dispatch,
    loading,
    total,
    showDelete: false,
    dataSource: list,
    onFilterChange: (data) => {

    },
    filter: [
      {
        title: '登录名',
        dataIndex: 'userLike',
        tag: <Input placeholder="用户名称、登录号、手机、邮箱" />,
      },
    ],
    columns: [
      {
        title: '登录名',
        dataIndex: 'login',
      },
      {
        title: '用户名称',
        dataIndex: 'name',
      },
      {
        title: '授权角色',
        dataIndex: 'roleNames',
      },
      {
        title: '客户编号',
        dataIndex: 'empCode',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '是否生效',
        dataIndex: 'deleteFlag',
        render: (value, record, index) => (value ? '否' : '是'),
      },
      {
        title: '操作',
        dataIndex: '',
        render: (value, record, index) => (
          <div>
            <Popconfirm
              title="确定要重置么？"
              okText="是"
              cancelText="否"
              onConfirm={handlePwdReset.bind(this, record)}
            >
              <Tooltip title="密码重置">
                <Button size={'small'} shape="circle" icon="key" />
              </Tooltip>
            </Popconfirm>
            <span style={{ paddingLeft: 10, paddingRight: 10 }}>|</span>
            <Switch
              size="small"
              checked={!record.deleteFlag}
              onChange={checked => {
                dispatch({
                  type: checked ? `${domain}/enable` : `${domain}/disable`,
                  payload: {
                    id: record.id,
                  },
                })
              }}
            />
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

export default connect(({ users, loading }) => ({ users, loading }))(User)
