import React from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Form, Input, message, Modal, Row } from 'antd'
import { EditableDataTable } from '../../../components'
import { formUtils } from '../../../utils'

const FormItem = Form.Item

const formItemLayout = {
  colon: false,
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
  style: {
    // marginBottom: 20,
  },
}

const ColProps = {
  xs: 24,
  sm: 24,
  md: 12,
  xl: 12,
  style: {},
}

const modal = ({
  mode,
  domain,
  readOnly,
  record,
  udcItems: { list },
  onOk,
  onCancel,
  dispatch,
  loading,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const items = [
    {
      title: '领域编号',
      dataIndex: 'domainCode',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <Input disabled={readOnly} />,
    },
    {
      title: '字典编号',
      dataIndex: 'udcCode',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <Input disabled={readOnly} />,
    },
    {
      title: '字典名称',
      dataIndex: 'udcName',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <Input disabled={readOnly} />,
    },
    {
      title: '字典描述',
      dataIndex: 'udcDesc',
      tag: <Input disabled={readOnly} />,
    },
  ]

  /**
   *
   * @param key      字段名
   * @param index    行号
   * @param newValue 新值
   */
  const handleChange = (key, index, newValue) => {
    dispatch({ type: 'udcItems/updateCell', payload: { key, index, value: newValue } })
  }

  const tableProps = {
    showCopy: false,
    showView: false,
    showDelete: true,
    size: 'small',
    domain: 'udcItems',
    domainCN: 'UDC值',
    dispatch,
    loading,
    readOnly,
    dataSource: list,
    columns: [
      {
        title: '取值编号',
        dataIndex: 'valCode',
        required: true,
        render: (value, row, index) => {
          return (
            <Input
              disabled={row.id > 0}
              size="small"
              value={value}
              onChange={e => {
                handleChange('valCode', index, e.target.value)
              }}
            />
          )
        },
      },
      {
        title: '取值内容',
        dataIndex: 'valDesc',
        required: true,
        render: (value, row, index) => {
          return (
            <Input
              disabled={readOnly}
              size="small"
              value={value}
              onChange={e => {
                handleChange('valDesc', index, e.target.value)
              }}
            />
          )
        },
      },
      {
        title: '特殊处理码1',
        dataIndex: 'valSphd1',
        render: (value, row, index) => {
          return (
            <Input
              disabled={readOnly}
              size="small"
              value={value}
              onChange={e => {
                handleChange('valSphd1', index, e.target.value)
              }}
            />
          )
        },
      },
      {
        title: '特殊处理码2',
        dataIndex: 'valSphd2',
        render: (value, row, index) => {
          return (
            <Input
              disabled={readOnly}
              size="small"
              value={value}
              onChange={e => {
                handleChange('valSphd2', index, e.target.value)
              }}
            />
          )
        },
      },
      {
        title: '显示顺序',
        dataIndex: 'sortNo',
        render: (value, row, index) => {
          return (
            <Input
              disabled={readOnly}
              size="small"
              value={value}
              onChange={e => {
                handleChange('sortNo', index, e.target.value)
              }}
            />
          )
        },
      },
    ],
    enableSelection: true,
    rowSelection: {
      getCheckboxProps: record => ({ disabled: record.id > 0 }),
    },
  }

  const handleOk = () => {
    if (mode === 'view') {
      onOk({})
    }

    validateFields(errors => {
      if (errors) {
        return 0
      }

      const data = {
        ...getFieldsValue(),
      }

      // 检查空字段
      if (list && formUtils.checkEmptyField(list, tableProps.columns) === true) {
        message.error('请输入明细的必填项', 3)
        return 0
      }

      const reg = /^[+]?\d+$/
      let isNumber = true
      list.forEach(l => {
        if (!reg.test(l.sortNo)) {
          isNumber = false
          return 0
        }
      })

      if (!isNumber) {
        message.error('显示顺序必须是数字', 3)
        return 0
      }

      onOk(data)
    })
  }

  const handleCancel = () => {
    onCancel()
  }

  const modalOpts = {
    ...modalProps,
    onCancel: handleCancel,
    footer: [
      <Button key="back" onClick={handleCancel}>
        取消
      </Button>,
      !readOnly && (
        <Button
          key="submit"
          type="primary"
          loading={mode === 'create' ? loading.effects[`${domain}/create`] : loading.effects[`${domain}/update`]}
          onClick={handleOk}
        >
          保存
        </Button>
      ),
    ],
  }

  const renderItem = item => {
    return (
      <Col key={item.dataIndex} {...ColProps} {...item.colProps}>
        <FormItem
          label={item.title}
          hasFeedback={!readOnly && !!item.options && !!item.options.rules}
          {...formItemLayout}
          {...item.formItemLayout}
        >
          {getFieldDecorator(item.dataIndex, {
            ...item.options,
            initialValue: record[`${item.dataIndex}`] || (item.options && item.options.initialValue),
          })(item.tag)}
        </FormItem>
      </Col>
    )
  }

  return (
    <Modal {...modalOpts}>
      <Row type="flex" justify="start">
        {items.map(item => renderItem(item))}
      </Row>
      <EditableDataTable {...tableProps} />
    </Modal>
  )
}

modal.propTypes = {
  readOnly: PropTypes.bool,
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  record: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
