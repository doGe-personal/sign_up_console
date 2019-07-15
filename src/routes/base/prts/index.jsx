import React from 'react'
import { connect } from 'dva'
import Modal from './Modal'
import { config } from '../../../utils'
import { DataTable, Page, UdcSelect } from '../../../components'
import { Button, Input, Upload } from 'antd'

const { api, baseURL } = config
const { ei } = api
const { download } = ei
const Present = ({ dispatch, prts, loading, jdcards }) => {
  const { list, total, currentItem, modalVisible, mode } = prts

  const domain = 'prts'
  const domainCN = '奖品管理'

  const modalProps = {
    dispatch,
    loading,
    mode,
    domain,
    jdcards,
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

  const hanleUpload = ({ data, file, filename }) => {
    const { prtId } = data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('prtId', prtId)
    dispatch({
      type: 'jdcards/handleUpload',
      payload: formData,
    })
  }

  const handleDownTmpl = () => {
    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.href = baseURL + '/' + download.replace('{repoId}', 'template').replace('{file}', 'jdcards-template.xlsx')
    a.download = 'jdcards-template.xlsx'
    a.click()
  }

  const tableProps = {
    domain,
    dispatch,
    loading,
    total,
    dataSource: list,
    showDelete: false,
    rowKey: 'id',
    onFilterChange: (data) => {

    },
    customBtn: <Button
      icon="cloud-download" type="primary" onClick={handleDownTmpl}
      style={{ marginRight: 6 }}>模版</Button>,
    filter: [{
      title: '奖品名称',
      dataIndex: 'prtName',
      tag: <Input />,
    }, {
      title: '奖品类型',
      dataIndex: 'prtType',
      tag: <UdcSelect domain="awards" code="awards_type" />,
    },
    ],
    columns: [{
      title: '编码',
      dataIndex: 'id',
    }, {
      title: '奖品名称',
      dataIndex: 'prtName',
    }, {
      title: '奖品类型',
      dataIndex: 'prtTypeName',
    }, {
      title: '奖品金额',
      dataIndex: 'prtAmt',
    }, {
      title: '奖品总数',
      dataIndex: 'prtNum',
    }, {
      title: '发放数量',
      dataIndex: 'sendNum',
    }, {
      title: '锁定数量',
      dataIndex: 'lockNum',
    }, {
      title: '剩余数量',
      dataIndex: 'remainNum',
    }, {
      title: '上传',
      dataIndex: '',
      render: (value, record, index) => (
        <Upload
          accept={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'}
          customRequest={hanleUpload.bind(this)}
          data={{ prtId: record.id }}
          showUploadList={false}
          // style={{ marginLeft: 8 }}
        >
          <Button
            icon="cloud-upload"
            shape="circle"
            type="primary"
          />
        </Upload>
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

export default connect(({ prts, jdcards, loading }) => ({ prts, jdcards, loading }))(Present)
