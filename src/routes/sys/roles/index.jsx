import React from 'react'
import { connect } from 'dva'
import Modal from './Modal'
import { DataTable, Page } from '../../../components'
import { Switch } from 'antd'

const Role = ({ dispatch, roles, loading }) => {
  const { list, total, currentItem, modalVisible, mode } = roles

  const domain = 'roles'

  const modalProps = {
    dispatch,
    loading,
    mode,
    domain,
    roles,
    record: currentItem,
    visible: modalVisible,
    maskClosable: false,
    width: '80%',
    confirmLoading: mode === 'create' ? loading.effects[`${domain}/create`] : loading.effects[`${domain}/update`],
    readOnly: mode === 'view',
    title: '角色菜单管理',
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
        title: '授权角色',
        dataIndex: 'roleLike',
      },
    ],
    columns: [
      {
        title: '角色名称',
        dataIndex: 'name',
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
export default connect(({ roles, loading }) => ({ roles, loading }))(Role)
