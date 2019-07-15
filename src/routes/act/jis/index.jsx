import React from 'react'
import { connect } from 'dva'
import { DataTable, Page } from '../../../components'
import { Button, Col, Icon, Input, Popover, Row, Select, Table, Tooltip } from 'antd'
import { config } from '../../../utils'
import ViewModal from './ViewModal'
import ConfirmModal from './ConfirmModal'
import styles from '../../../themes/signup.less'

const Option = Select.Option
const { api, baseURL } = config
const { ei } = api
const { imgDownload } = ei
const JI = ({ dispatch, jis, loading }) => {
  const { list, total, viewModalVisble, currItem, confirmModalVisble, noPassList, expandedRowKeys } = jis

  const domain = 'jis'

  const handleInput = (record, e) => {
    dispatch({
      type: `${domain}/onInputChange`,
      payload: {
        key: record.id,
        value: e,
      },
    })
  }

  const handleClickImg = record => () => {
    dispatch({
      type: `${domain}/showViewModal`,
      payload: record,
    })
  }

  const viewModalProps = {
    dispatch,
    loading,
    domain,
    record: currItem,
    visible: viewModalVisble,
    maskClosable: false,
    width: '60%',
    title: '店员上传照片',
    onCancel() {
      dispatch({
        type: `${domain}/hideViewModal`,
      })
    },
  }

  const confirmModalProps = {
    width: '60%',
    visible: confirmModalVisble,
    list: noPassList,
    title: '审批失败列表',
    onClose: () => {
      dispatch({
        type: `${domain}/hideConfirmModal`,
      })
    },
  }

  const expandedRowRender = (record, index) => {
    const columns = [
      { title: '商品编码', dataIndex: 'itemCode', key: 'itemCode' },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName' },
      { title: '购买数量', dataIndex: 'itemQty', key: 'itemQty' },
      {
        title: '活动参与图片',
        render: (text, record) =>
          record.jidImg ? (
            <Tooltip title="点击放大图片" placement="right">
              <div
                onClick={handleClickImg(record)}
              >
                <img
                  alt="提交图片"
                  style={{ width: '60px' }}
                  src={
                    baseURL + '/' + imgDownload.replace('{file}', record.jidImg)
                  }
                /></div>
            </Tooltip>
          ) : (
            <span>空</span>
          ),
      },
    ]

    return (
      <Table
        loading={loading.effects['jis/onExpand']}
        rowKey="itemCode"
        columns={columns}
        dataSource={list[index].itemList}
        pagination={false}
      />
    )
  }

  const handleExpand = (expanded, record) => {
    if (expanded && record.itemList === void 0) {
      dispatch({
        type: `${domain}/onExpand`,
        payload: record.id,
      })
    } else {
      dispatch({
        type: `${domain}/onCloseExpand`,
        payload: record.id,
      })
    }
  }

  const togglePop = record => {
    dispatch({
      type: `${domain}/togglePop`,
      payload: record,
    })
  }

  const handleReject = id => {
    dispatch({
      type: `${domain}/onReject`,
      payload: id,
    })
  }

  const handlePass = id => {
    dispatch({
      type: `${domain}/onPass`,
      payload: id,
    })
  }

  if (list && list.length > 0) {
    list.forEach((element, index) => {
      element.key = ++index
    })
  }

  const tableProps = {
    domain,
    dispatch,
    loading,
    total,
    dataSource: list,
    showDelete: false,
    showAdd: false,
    showEdit: false,
    showView: false,
    enableSelection: true,
    expandedRowRender: expandedRowRender,
    onExpand: handleExpand,
    expandedRowKeys: expandedRowKeys,
    buttons: [
      {
        key: 'pass',
        requiredSelected: 2,
        type: 'primary',
        name: '批量通过',
        cb: (selectedRowKeys, searchBarForm, selectedRows) => {
          const nexamineArr = selectedRows.filter(e => e.checkStatus === '1')
          const ids = nexamineArr.map(e => e.id)
          dispatch({
            type: `${domain}/patchExamine`,
            payload: { ids: ids, checkStatus: 2 },
          })
        },
      }, {
        key: 'reject',
        requiredSelected: 2,
        type: 'danger',
        name: '批量拒绝',
        cb: (selectedRowKeys, searchBarForm, selectedRows) => {
          const nexamineArr = selectedRows.filter(e => e.checkStatus === '1')
          const ids = nexamineArr.map(e => e.id)
          dispatch({
            type: `${domain}/patchExamine`,
            payload: { ids: ids, checkStatus: 3 },
          })
        },
      },
    ],
    filter: [{
      title: '参与人',
      dataIndex: 'custName',
      tag: <Input />,
    }, {
      title: '审批状态',
      dataIndex: 'checkStatus',
      tag: <Select>
        <Option value="1">待审批</Option>
        <Option value="2">已通过</Option>
        <Option value="3">已拒绝</Option>
      </Select>,
    },
    ],
    rowSelection: {
      getCheckboxProps: record => ({
        disabled: record.checkStatus !== '1',
        name: record.checkStatus,
      }),
    },
    columns: [
      {
        title: '活动名称',
        dataIndex: 'actTitle',
      }, {
        title: '参与人',
        dataIndex: 'custName',
      }, {
        title: '参与手机',
        dataIndex: 'custMobile',
      }, {
        title: '参与时间',
        dataIndex: 'jiTime',
      }, {
        title: '销售门店',
        dataIndex: 'ouName',
      }, {
        title: '店员名称',
        dataIndex: 'agentName',
      }, {
        title: '销量(件)',
        dataIndex: 'sendNum',
      }, {
        title: '审批',
        dataIndex: 'approve',
        render: (value, record, index) => (
          <div>
            {record.checkStatus === '1' ? (
              <Popover
                placement="left"
                trigger="hover"
                visible={record.confirmVisable}
                content={
                  <div>
                    <Row style={{ marginBottom: 8 }}>
                      <Col span={8} className={styles.confirmModal}>
                        审批意见:
                      </Col>
                      <Col span={16}>
                        <Input
                          onChange={e => {
                            handleInput(record, e.target.value)
                          }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={18} offset={6}>
                        <Button
                          size="small"
                          type="danger"
                          style={{ marginRight: 8 }}
                          onClick={() => {
                            handleReject(record.id)
                          }}
                        >
                          拒绝
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          style={{ marginRight: 8 }}
                          onClick={() => {
                            handlePass(record.id)
                          }}
                        >
                          通过
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            dispatch({
                              type: `${domain}/togglePopByKey`,
                              payload: record.id,
                            })
                          }}
                        >
                          取消
                        </Button>
                      </Col>
                    </Row>
                  </div>
                }
                title={null}
              >
                <Button
                  type="primary"
                  icon="edit"
                  shape="circle"
                  onClick={() => {
                    togglePop(record)
                  }}
                />
              </Popover>
            ) : (
              <div>
                {record.checkStatus === '2' ? (
                  <Icon
                    type="check-circle"
                    theme="twoTone"
                    twoToneColor="#52c41a"
                  />
                ) : (
                  <Icon
                    type="close-circle"
                    theme="twoTone"
                    twoToneColor="red"
                  />
                )}
                <span>{record.checkStatusName}</span>
              </div>
            )}
          </div>
        ),
      },
    ],
  }

  return (
    <Page inner>
      <DataTable {...tableProps} />
      {viewModalVisble && <ViewModal {...viewModalProps} />}
      {confirmModalVisble && <ConfirmModal {...confirmModalProps} />}
    </Page>
  )
}

export default connect(({ jis, loading }) => ({ jis, loading }))(JI)
