import React from 'react'
import { connect } from 'dva'
import { DataTable, Page } from '../../../components'
import { Icon, Popover } from 'antd'
import dataUtils from '../../../utils/dataUtils'

const Reclog = ({ dispatch, reclogs, loading }) => {
  const { list, total } = reclogs

  const domain = 'reclogs'

  const tableProps = {
    domain,
    dispatch,
    loading,
    total,
    showDelete: false,
    showAdd: false,
    showView: false,
    showEdit: false,
    enableSelection: false,
    dataSource: list,
    columns: [{
      title: '微信唯一编码',
      dataIndex: 'busiCode',
      align: 'left',
    }, {
      title: '图片路径',
      dataIndex: 'imgPath',
      align: 'left',
      render: (value, record, index) => <p style={{ width: 400 }}>{value}</p>,
    }, {
      title: '识别结果',
      dataIndex: 'ocrResult',
      align: 'left',
      render: (value, record, index) => (
        <Popover content={<p style={{ width: 500 }}>{value}</p>} title="扫码返回详情">
          {value ? value.substring(0, 40) : ''}
        </Popover>
      ),
    }, {
      title: '识别成功',
      dataIndex: 'successFlag',
      render: (value, record, index) =>
        value ?
          <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> :
          <Icon type="close-circle" theme="twoTone" twoToneColor="red" />,
    }, {
      title: '扫描时间',
      dataIndex: 'createTime',
      render: (value, row, index) => {
        return dataUtils.dtm(value)
      },
    },
    ],
  }

  return (
    <Page inner>
      <DataTable {...tableProps} />
    </Page>
  )
}
export default connect(({ reclogs, loading }) => ({ reclogs, loading }))(Reclog)
