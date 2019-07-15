import React from 'react'
import { connect } from 'dva'
import { EditableDataTable, Page, SuggestSelect } from '../../../components'
import { BackTop, Button, Card, Icon, InputNumber, message, Table, Upload } from 'antd'
import styles from '../../../themes/signup.less'
import ActForm from './form'
import { config, formUtils } from '../../../utils'
// import ItemModal from './ItemModal'
import IcodeModal from './icodeModal'

const { api, baseURL } = config
const { ei } = api
const { streamDownload } = ei

const Detail = ({ dispatch, actsForm, actsDetail, actsItems, actsRules, actsLimits, loading }) => {
  const { formData, mode } = actsForm
  // const { itemModalVisable,icodeModalVisable, list: itemList, total: itemTotal, selectedRowKeys, actItems, actSelectKeys } = actsItems
  const { icodeModalVisable, actItems, actSelectKeys } = actsItems
  const { list: detailList } = actsDetail
  const { list: ruleList } = actsRules
  const { list: limitList } = actsLimits
  const readOnly = (mode === 'view')

  const handleFormChange = (values) => {
    dispatch({
      type: 'actsForm/handleChangeField',
      payload: values,
    })
  }

  const handleUploadCoverImg = (fileData) => {
    dispatch({
      type: 'actsForm/uploadCoverImg',
      payload: fileData,
    })
  }

  const handleUploadIconImg = (fileData) => {
    dispatch({
      type: 'actsForm/uploadIconImg',
      payload: fileData,
    })
  }

  const handleGoBack = () => {
    dispatch({
      type: 'actsForm/handleGoBack',
    })
  }


  const hanleUploadDetailImg = ({ data, file, filename }) => {
    const formData = new FormData()
    formData.append('file', file)
    dispatch({
      type: 'actsDetail/uploadImg',
      payload: { fileData: formData, row: data },
    })
  }
  /**
   *
   * @param key      字段名
   * @param index    行号
   * @param newValue 新值
   */
  const handleDetailChange = (key, index, newValue) => {
    dispatch({ type: 'actsDetail/updateCell', payload: { key, index, value: newValue } })
  }

  const actDetailTableProps = {
    showCopy: false,
    showView: false,
    showDelete: true,
    size: 'small',
    domain: 'actsDetail',
    domainCN: '活动组图',
    dispatch,
    loading,
    readOnly,
    dataSource: detailList,
    scroll: { y: 480 },
    columns: [
      {
        title: '图片',
        dataIndex: 'adImg',
        required: true,
        readOnly: false,
        width: '60%',
        render: (value, record, index) => {
          return (
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={hanleUploadDetailImg.bind(this)}
              accept="image/*"
              disabled={readOnly}
              data={{ key: 'adImg', index: index }}
            >
              {record.adImg ?
                <img style={{ width: '100%' }} src={`${baseURL}/${streamDownload.replace('{file}', record.adImg)}`}
                  alt="详情" /> :
                <div className={styles.act_upload_text}>
                  <Icon type={'plus'} />
                  <div>添加详情组图</div>
                </div>
              }
            </Upload>
          )
        },
      },
      {
        title: '显示顺序',
        dataIndex: 'orderNum',
        required: true,
        width: '40%',
        render: (value, row, index) => {
          return (
            <InputNumber
              disabled={readOnly}
              size="small"
              value={value}
              min={0}
              onChange={e => {
                handleDetailChange('orderNum', index, e)
              }}
            />
          )
        },
      },
    ],
    enableSelection: true,
    rowSelection: {
      // getCheckboxProps: record => ({ disabled: record.id > 0 }),
    },
  }

  const handleSubmit = () => {
    // 检查空字段
    if (detailList.length < 1) {
      message.warning('请维护图片组图', 3)
      return 0
    }
    if (detailList && formUtils.checkEmptyField(detailList, actDetailTableProps.columns) === true) {
      message.warning('请输入图片组图的必填项', 3)
      return 0
    }
    if (actsItems.length < 1) {
      message.warning('请维护参与商品', 3)
      return 0
    }
    if (ruleList.length < 1) {
      message.warning('请维护活动奖励规则', 3)
      return 0
    }
    // 检查空字段
    if (ruleList && formUtils.checkEmptyField(ruleList, ruleTableProps.columns) === true) {
      message.warning('请输入活动奖励规则的必填项', 3)
      return 0
    }
    // 检查空字段
    if (limitList && formUtils.checkEmptyField(limitList, limitTableProps.columns) === true) {
      message.warning('请输入经销商奖品配额的必填项', 3)
      return 0
    }
    dispatch({
      type: 'actsForm/save',
      payload: dispatch,
    })
  }
  const columns = [{
    title: '商品名称',
    dataIndex: 'itemName',
  }, {
    title: '编号',
    dataIndex: 'itemCode',
  }, {
    title: '品牌',
    dataIndex: 'itemBrand',
  }, {
    title: '规格',
    dataIndex: 'itemSpec',
  }, {
    title: '花纹',
    dataIndex: 'tyreTread',
  }, {
    title: '操作',
    render: (text, record) => (
      <Button icon="delete" disabled={readOnly} type="danger" onClick={() => {
        dispatch({
          type: 'actsItems/deleteRow',
          payload: record.id,
        })
      }} />
    ),
  }]

  const rowSelection = {
    selectedRowKeys: actSelectKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: 'actsItems/updateState',
        payload: {
          actSelectKeys: selectedRowKeys,
          // actItems: selectedRows,
        },
      })
    },
    getCheckboxProps: record => ({}),
  }

  // const handleAddItem = () => {
  //   dispatch({
  //     type: 'actsItems/showModal',
  //   })
  // }
  const handleByCode = () => {
    dispatch({
      type: 'actsItems/showModal',
    })
  }
  // const itemModalProps = {
  //   dispatch,
  //   loading,
  //   mode,
  //   list: itemList,
  //   total: itemTotal,
  //   domain: 'actsItems',
  //   visible: itemModalVisable,
  //   selectedRowKeys,
  //   maskClosable: false,
  //   width: '60%',
  //   readOnly: mode === 'view',
  //   title: '选择活动参与商品',
  //   wrapClassName: 'vertical-center-modal',
  //   onOk(data) {
  //     dispatch({
  //       type: `actsItems/handleConfirm`,
  //       payload: data,
  //     })
  //   },
  //   onCancel() {
  //     dispatch({
  //       type: 'actsItems/hideModal',
  //     })
  //   },
  // }
  const icodeModalProps = {
    dispatch,
    loading,
    mode,
    visible: icodeModalVisable,
    onOk() {
      dispatch({
        type: `actsItems/handleIcodeConfirm`,
      })
    },
    onCancel() {
      dispatch({
        type: 'actsItems/hideModal',
      })
    },
    handleInputNu(e) {
      dispatch({
        type: 'actsItems/handleInputNu',
        payload: e.target.value,
      })
    },
  }
  const itemTableProps = {
    rowKey: 'id',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
    },
    enableSelection: false,
  }
  /**
   *
   * @param key      字段名
   * @param index    行号
   * @param newValue 新值
   */
  const handleRuleChange = (key, index, newValue) => {
    dispatch({ type: 'actsRules/updateCell', payload: { key, index, value: newValue } })
  }
  /**
   *
   * @param key      字段名
   * @param index    行号
   * @param newValue 新值
   */
  const handleLimitChange = (key, index, newValue) => {
    dispatch({ type: 'actsLimits/updateCell', payload: { key, index, value: newValue } })
  }

  const ruleTableProps = {
    showCopy: false,
    showView: false,
    showDelete: true,
    size: 'small',
    domain: 'actsRules',
    domainCN: '活动奖励规则',
    dispatch,
    loading,
    readOnly,
    dataSource: ruleList,
    scroll: { y: 480 },
    columns: [
      {
        title: '购买数量条件',
        readOnly: readOnly,
        width: 320,
        children: [{
          title: '下限(≥)',
          dataIndex: 'limitFrom',
          key: 'limitFrom',
          width: 160,
          render: (value, row, index) => {
            return (
              <InputNumber
                disabled={readOnly}
                size="small"
                value={value}
                min={0}
                onChange={e => {
                  handleRuleChange('limitFrom', index, e)
                }}
              />
            )
          },
        }, {
          title: '上限(≤)',
          dataIndex: 'limitTo',
          key: 'limitTo',
          width: 160,
          render: (value, row, index) => {
            return (
              <InputNumber
                disabled={readOnly}
                size="small"
                value={value}
                min={0}
                onChange={e => {
                  handleRuleChange('limitTo', index, e)
                }}
              />
            )
          },
        }],
      },
      {
        title: '奖品信息',
        dataIndex: 'prtId',
        required: true,
        width: 360,
        render: (value, row, index) => {
          return (
            <SuggestSelect disabled={readOnly}
              optionKey="id"
              value={value}
              onChange={e => {
                handleRuleChange('prtId', index, e)
              }}
              apiName="presents" showCode="true" />
          )
        },
      },
      {
        title: '奖品数量',
        dataIndex: 'prtQty',
        required: true,
        width: 300,
        render: (value, row, index) => {
          return (
            <InputNumber
              disabled={readOnly}
              size="small"
              value={value}
              min={0}
              onChange={e => {
                handleRuleChange('prtQty', index, e)
              }}
            />
          )
        },
      },
    ],
    enableSelection: true,
    rowSelection: {
      // getCheckboxProps: record => ({ disabled: record.id > 0 }),
    },
  }
  const limitTableProps = {
    showCopy: false,
    showView: false,
    showDelete: true,
    size: 'small',
    domain: 'actsLimits',
    domainCN: '经销商奖品配额',
    dispatch,
    loading,
    readOnly,
    dataSource: limitList,
    // scroll: { y: 480 },
    columns: [
      {
        title: '经销商',
        required: true,
        dataIndex: 'ouCode',
        readOnly: false,
        render: (value, row, index) => {
          return (
            <SuggestSelect disabled={readOnly}
              value={value}
              params={{ ouType: '0' }}
              optionKey="code" apiName="orgs"
              onChange={e => {
                handleLimitChange('ouCode', index, e)
              }}
              showCode="true" />
          )
        },
      },
      {
        title: '奖品',
        dataIndex: 'prtId',
        required: true,
        render: (value, row, index) => {
          return (
            <SuggestSelect disabled={readOnly} optionKey="id"
              value={value}
              onChange={e => {
                handleLimitChange('prtId', index, e)
              }}
              apiName="presents" showCode="true" />
          )
        },
      },
      {
        title: '分配额度',
        dataIndex: 'prtQty',
        required: true,
        render: (value, row, index) => {
          return (
            <InputNumber
              disabled={readOnly}
              size="small"
              value={value}
              min={0}
              onChange={e => {
                handleLimitChange('prtQty', index, e)
              }}
            />
          )
        },
      },
      {
        title: '已使用配额',
        dataIndex: 'usedQty',
        render: (value, row, index) => {
          return (
            <span>{value}</span>
          )
        },
      },
    ],
    enableSelection: true,
    rowSelection: {
      // getCheckboxProps: record => ({ disabled: record.id > 0 }),
    },
  }

  return (
    <Page inner className={styles.act_base} ref={(node) => {
      this.container = node
    }}>
      <BackTop />
      <ActForm record={formData} limitReadOnly={formData.limitFlag === '0' || !formData.limitFlag} readOnly={readOnly}
        onOk={handleSubmit} onGoBack={handleGoBack} onFieldsChange={handleFormChange}
        onUploadCoverImg={handleUploadCoverImg} onUploadIconImg={handleUploadIconImg} />
      <Card title="活动组图(建议: 宽:750)" className={styles.act_detail}>
        <EditableDataTable {...actDetailTableProps} />
      </Card>
      {/*<Card title="参与活动商品" className={styles.act_detail} extra={!readOnly && <Button type="primary" icon="plus" onClick={handleAddItem} />}>*/}
      <Card title="参与活动商品" className={styles.act_detail}
        extra={!readOnly && <Button type="primary" onClick={handleByCode}>批量添加</Button>}>
        <Table {...itemTableProps} rowSelection={rowSelection} columns={columns} dataSource={actItems} />
        {/* {itemModalVisable && <ItemModal {...itemModalProps} />} */}
        {icodeModalVisable && <IcodeModal {...icodeModalProps} />}
      </Card>
      <Card title="活动奖励规则" className={styles.act_detail}>
        <EditableDataTable {...ruleTableProps} />
      </Card>
      <Card title="经销商奖品配置" className={styles.act_detail}>
        <EditableDataTable {...limitTableProps} />
      </Card>
    </Page>
  )
}

export default connect(({ dispatch, actsForm, actsDetail, actsItems, actsRules, actsLimits, loading }) => ({
  dispatch,
  actsForm,
  actsDetail,
  actsItems,
  actsRules,
  actsLimits,
  loading,
}))(Detail)
