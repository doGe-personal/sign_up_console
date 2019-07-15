import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Alert, Button, Divider, Popconfirm } from 'antd'
import Modal from './Modal'
import { DataTable, Page } from '../../../components'

const Udc = ({ dispatch, udcs, udcItems, loading }) => {
  const { list, total, currentItem, modalVisible, mode } = udcs

  const domain = 'udcs'
  const domainCN = '数据字典'

  const modalProps = {
    dispatch,
    loading,
    udcItems,
    mode,
    domain,
    record: currentItem,
    visible: modalVisible,
    maskClosable: false,
    width: '65%',
    confirmLoading: mode === 'create' ? loading.effects[`${domain}/create`] : loading.effects[`${domain}/update`],
    readOnly: mode === 'view' || currentItem.sysFlag,
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
    showAdd: true,
    showDelete: false,
    showEdit: true,
    dataSource: list,
    sortBy: 'domainCode',
    onFilterChange: (data) => {

    },
    filter: [
      {
        title: '数据字典',
        dataIndex: 'udcLike',
      },
    ],
    columns: [
      {
        title: '类型',
        dataIndex: 'sysFlag',
        render: value => (value ? '系统保留' : '用户定义'),
      },
      {
        //   title: '状态',
        //   dataIndex: '',
        //   width: '5%',
        //   render: (value, record, index) => {
        //     return record.sysFlag ? <Icon type="lock" style={{ fontSize: 18, color: '#08c' }} /> : '';
        //   }
        // }, {
        title: '领域编号',
        dataIndex: 'domainCode',
      },
      {
        title: '字典编号',
        dataIndex: 'udcCode',
      },
      {
        title: '字典名称',
        dataIndex: 'udcName',
      },
      {
        title: '字典描述',
        dataIndex: 'udcDesc',
        className: 'alignLeft',
      },
    ],
    rowSelection: {
      type: 'radio',
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        dispatch({
          type: `${domain}/editable`,
          payload: {
            showEdit: !record.sysFlag,
          },
        })
      },
      // getCheckboxProps: record => ({
      //   disabled: record.sysFlag,
      // }),
    },
  }

  const handleClearCache = () => {
    dispatch({ type: `${domain}/clearCache` })
  }

  return (
    <Page inner>
      <Popconfirm title={'确定要清空UDC缓存么?'} placement="bottomLeft" onConfirm={handleClearCache}>
        <Button type="danger" loading={loading.effects[`${domain}/clearCache`]}>
          清空UDC缓存
        </Button>
      </Popconfirm>
      <Alert
        message="手动清空服务端UDC缓存，通常用于数据库UDC变更之后"
        type="warning"
        showIcon
        style={{ width: 500, display: 'inline', marginRight: 20 }}
      />
      <Divider />
      <DataTable {...tableProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

Udc.propTypes = {
  udcs: PropTypes.object,
  udcValues: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ udcs, udcItems, loading }) => ({ udcs, udcItems, loading }))(Udc)
