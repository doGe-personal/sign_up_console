import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { DatePicker } from 'antd'
import Modal from './Modal'
import { DataTable, Page, Suggest } from '../../../components'
import { dataUtils } from '../../../utils'

const RangePicker = DatePicker.RangePicker

const Logs = ({ dispatch, logs, loading }) => {
  const { list, total, currentItem, modalVisible, mode } = logs

  const domain = 'logs'
  const domainCN = '操作日志'

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
    enableDoubleClick: false,
    enableSelection: false,
    showAdd: false,
    showDelete: false,
    showEdit: false,
    showView: false,
    dataSource: list,
    onFilterChange: (data) => {

    },
    filter: [
      {
        title: '类别',
        dataIndex: 'userName',
        tag: <Suggest apiName="emps" />,
        colProps: {
          xs: 24,
          sm: 24,
          md: 8,
          lg: 8,
          xl: 8,
        },
      },
      {
        title: '用户名称',
        dataIndex: 'moduleName',
        colProps: {
          xs: 24,
          sm: 24,
          md: 8,
          lg: 8,
          xl: 8,
        },
      },
      {
        title: '内容',
        dataIndex: 'moduleContent',
        colProps: {
          xs: 24,
          sm: 24,
          md: 8,
          lg: 8,
          xl: 8,
        },
      },
      {
        title: '操作时间',
        dataIndex: 'operTime',
        className: 'alignLeft',
        tag: <RangePicker format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} showTime />,
        colProps: {
          xs: 24,
          sm: 24,
          md: 12,
          lg: 12,
          xl: 12,
        },
        // formItemLayout: {
        //   labelCol: { span: 4 },
        //   wrapperCol: { span: 20 },
        // },
      },
    ],
    columns: [
      {
        title: '序号',
        dataIndex: 'userName',
        sorter: true,
        width: '10%',
      },
      {
        title: '类型',
        dataIndex: 'moduleName',
        sorter: true,
        width: '15%',
      },
      {
        title: '来源',
        dataIndex: 'menuName',
        sorter: true,
        width: '15%',
      },
      {
        title: '内容',
        dataIndex: 'uri',
        sorter: true,
        width: '40%',
      },
      {
        title: '操作时间',
        dataIndex: 'operTime',
        sorter: true,
        width: '20%',
        render: (value, row, index) => {
          return dataUtils.dtm(value)
        },
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

Logs.propTypes = {
  logs: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ logs, loading }) => ({ logs, loading }))(Logs)
