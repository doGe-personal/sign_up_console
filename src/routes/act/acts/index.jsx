import React from 'react'
import { connect } from 'dva'
import { DataTable, Page } from '../../../components'
import { Button, Input, Popconfirm, Switch, Upload } from 'antd'
import { config } from '../../../utils'

const { api, baseURL } = config
const { ei } = api
const { download } = ei

const Act = ({ dispatch, acts, loading }) => {
  const { list, total } = acts

  const domain = 'acts'
  // const domainCN = '活动管理'

  const handleEnableAct = (record) => {
    dispatch({
      type: `${domain}/exchangStatus`,
      payload: record,
    })
  }

  const handleExport = (id) => {
    console.log(id)
    dispatch({
      type: `${domain}/exportFile`,
      payload: id,
    })
  }

  const handleImport = ({ data, file, filename }) => {
    const { actId } = data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('actId', actId)
    dispatch({
      type: `${domain}/handleUpload`,
      payload: formData,
    })
  }

  const handleDownTmpl = () => {
    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.href = baseURL + '/' + download.replace('{repoId}', 'template').replace('{file}', 'supplier-limit-tmpl.xlsx')
    a.download = 'supplier-limit-tmpl.xlsx'
    a.click()
  }

  const tableProps = {
    domain,
    dispatch,
    loading,
    total,
    dataSource: list,
    rowKey: 'id',
    customBtn: <Button
      icon="cloud-download" type="primary" onClick={handleDownTmpl}
      style={{ marginRight: 6 }}>
      供应商额度导入模版
    </Button>,
    onFilterChange: (data) => {

    },
    filter: [
      {
        title: '活动名称',
        dataIndex: 'title',
        tag: <Input />,
      },
    ],
    columns: [
      {
        title: '活动名称',
        dataIndex: 'title',
      },
      {
        title: '是否限购',
        dataIndex: 'limitFlag',
        render: (value, record, index) => (
          record.limitFlag === 1 ? '是' : '否'
        ),
      },
      {
        title: '限购数量',
        dataIndex: 'limitQty',
      }, {
        title: '活动起止日期',
        dataIndex: 'limitTime',
      }, {
        title: '领奖截止日期',
        dataIndex: 'acceptEndTime',
      }, {
        title: '创建人',
        dataIndex: 'createUserName',
      }, {
        title: '供应商配额导入与导出',
        dataIndex: 'export',
        render: (value, record, index) => (
          <div>
            <Upload
              accept={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'}
              customRequest={handleImport.bind(this)}
              data={{ actId: record.id }}
              showUploadList={false}
            >
              <Button
                icon="cloud-upload"
                shape="circle"
                type="primary"
                loading={loading.effects[`${domain}/handleUpload`]}
                // style={{ height: 30 }}
              />
            </Upload>
            <Button
              style={{ marginLeft: 8 }}
              type="primary"
              shape="circle"
              icon="cloud-download"
              onClick={handleExport.bind(this, record.id)}
            />
          </div>
        ),
      }, {
        title: '启用',
        dataIndex: 'enable',
        render: (value, record, index) => (
          <div>
            <Popconfirm
              title="确定要更改吗？"
              okText="是"
              cancelText="否"
              onConfirm={handleEnableAct.bind(this, record)}
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
    </Page>
  )
}

export default connect(({ acts, loading }) => ({ acts, loading }))(Act)
