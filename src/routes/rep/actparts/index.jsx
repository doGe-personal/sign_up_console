import React from 'react'
import { connect } from 'dva'
import { DataTable, Page } from '../../../components'
import { Button, DatePicker, Input } from 'antd'
import dataUtils from '../../../utils/dataUtils'

const { RangePicker } = DatePicker

const Actpart = ({ dispatch, actparts, loading }) => {
  const { list, total } = actparts

  const domain = 'actparts'

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
    showDelete: false,
    showAdd: false,
    showEdit: false,
    showView: false,
    enableSelection: false,
    scroll: { x: 1600 },
    customBtn: <Button icon="cloud-download" type="primary" onClick={handleExport}
      style={{ marginRight: 6 }}>批量导出</Button>,
    onFilterChange: (data) => {
      dispatch({
        type: `${domain}/onfilterData`,
        payload: data,
      })
    },
    filter: [{
      title: '活动名称',
      dataIndex: 'actTitle',
      tag: <Input />,
    }, {
      title: '活动时间',
      dataIndex: 'actTime',
      tag: <RangePicker />,
    }, {
      title: '车主姓名',
      dataIndex: 'custName',
      tag: <Input />,
    }, {
      title: '车牌',
      dataIndex: 'plateNo',
      tag: <Input />,
    }, {
      title: '店员',
      dataIndex: 'agentName',
      tag: <Input />,
    },
    ],
    columns: [{
      title: '活动名称',
      dataIndex: 'actTitle',
    }, {
      title: '参与时间',
      dataIndex: 'jiTime',
      render: (value, row, index) => {
        return dataUtils.dtm(value)
      },
    }, {
      title: '省市',
      dataIndex: 'province',
      render: (value, row, index) => {
        return `${value}-${row.city}`
      },
    }, {
      title: '经销商代码',
      dataIndex: 'ouCode0',
    }, {
      title: '经销商名',
      dataIndex: 'ouName0',
    }, {
      title: '零售商代码',
      dataIndex: 'ouCode1',
    }, {
      title: '零售商名',
      dataIndex: 'ouName1',
    }, {
      title: '店员',
      dataIndex: 'agentName',
    }, {
      title: '手机号',
      dataIndex: 'agentMobile',
    }, {
      title: '轮胎编码',
      dataIndex: 'itemCode',
    }, {
      title: '轮胎花纹',
      dataIndex: 'tyreTread',
    }, {
      title: '轮胎型号',
      dataIndex: 'itemSpec',
    }, {
      title: '数量',
      dataIndex: 'joinQty',
    }, {
      title: '车主姓名',
      dataIndex: 'custName',
    }, {
      title: '车主性别',
      dataIndex: 'sexName',
    }, {
      title: '品牌类型',
      dataIndex: 'spec',
    }, {
      title: '车牌',
      dataIndex: 'plateNo',
    },
    ],
  }

  return (
    <Page inner>
      <DataTable {...tableProps} />
    </Page>
  )
}

export default connect(({ actparts, loading }) => ({ actparts, loading }))(Actpart)
