import React from 'react'
import { connect } from 'dva'
import Modal from './Modal'
import { DataTable, Page, SuggestSelect } from '../../../components'
import { Button, Icon, Input, Popconfirm, Radio, Switch } from 'antd'

const RadioGroup = Radio.Group

const Agent = ({ dispatch, agents, loading }) => {
  const { list, total, currentItem, modalVisible, mode } = agents

  const domain = 'agents'
  const domainCN = '店员信息'

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

  const onConfirm = (record, e) => {
    dispatch({
      type: `${domain}/onConfirm`,
      payload: { id: record.id, agentStatus: e.target.value },
    })
  }

  const handleEnableAgent = (record) => {
    dispatch({
      type: `${domain}/exchangStatus`,
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
    showDelete: false,
    showAdd: false,
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
        title: '选择门店',
        dataIndex: 'ouCode',
        tag: <SuggestSelect params={{ ouType: '1' }} optionKey="code" apiName="orgs" showCode="true" />,
      },
      {
        title: '店员名称',
        dataIndex: 'agentName',
        tag: <Input />,
      },
    ],
    columns: [
      {
        title: '门店编码',
        dataIndex: 'ouCode',
      },
      {
        title: '门店名称',
        dataIndex: 'ouName',
      },
      {
        title: '店员编码',
        dataIndex: 'agentCode',
      },
      {
        title: '店员名称',
        dataIndex: 'agentName',
      }, {
        title: '职位',
        dataIndex: 'jobTitleName',
      },
      {
        title: '手机',
        dataIndex: 'mobile',
      },
      {
        title: '审核状态',
        dataIndex: 'agentStatus',
        render: (value, record, index) => (
          <div>
            {!!record.agentStatus && record.agentStatus !== '0' ? '已审核' : <span style={{ color: '#ef9939' }}>待审核</span>}
          </div>
        ),
      }, {
        title: '手工审核',
        render: (value, record, index) => (
          <div>
            {!record.agentStatus || record.agentStatus === '0' ?
              <RadioGroup onChange={onConfirm.bind(this, record)}>
                <Radio value={1}>通过</Radio>
                <Radio value={2}>拒绝</Radio>
              </RadioGroup>
              : <div>{record.agentStatus === '1' ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> :
                <Icon type="close-circle" theme="twoTone" twoToneColor="red" />} {record.agentStatusName}</div>
            }
          </div>
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
              onConfirm={handleEnableAgent.bind(this, record)}
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
    </Page>
  )
}

export default connect(({ agents, loading }) => ({ agents, loading }))(Agent)
