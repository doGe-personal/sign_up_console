import React from 'react'
// import moment from 'moment'
import { Button,Table, Col, Form, Input, InputNumber, Modal, Row } from 'antd'
import { UdcSelect } from '../../../components'

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
  jdcards: { list },
  onOk,
  onCancel,
  dispatch,
  loading,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const items = [
    {
      title: '奖品名称',
      dataIndex: 'prtName',
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
      title: '奖品类型',
      dataIndex: 'prtType',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
        initialValue: 'jd_card',
      },
      tag: <UdcSelect disabled={readOnly} domain="awards" code="awards_type" />,
    }, {
      title: '金额',
      dataIndex: 'prtAmt',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <InputNumber disabled={readOnly} min={1} />,
    },
  ]

  const handleOk = () => {
    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
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
      mode !== 'view' && (
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

  /**
   *
   * @param key      字段名
   * @param index    行号
   * @param newValue 新值
   */
  // const handleChange = (key, index, newValue) => {
  //   dispatch({ type: 'jdcards/updateCell', payload: { key, index, value: newValue } })
  // }

  const tableProps = {
    size: 'small',
    dataSource: list,
    columns: [
      {
        title: '卡号',
        dataIndex: 'jdcCode',
        // required: true,
        // render: (value, row, index) => {
        //   return (
        //     <Input
        //       disabled={readOnly}
        //       size="small"
        //       value={value}
        //       onChange={e => {
        //         handleChange('jdcCode', index, e.target.value)
        //       }}
        //     />
        //   )
        // },
      },
      {
        title: '密码',
        dataIndex: 'jdcPass',
        // required: true,
        // render: (value, row, index) => {
        //   return (
        //     <Input
        //       disabled={readOnly}
        //       size="small"
        //       value={value}
        //       onChange={e => {
        //         handleChange('jdcPass', index, e.target.value)
        //       }}
        //     />
        //   )
        // },
      },
      {
        title: '有效期至',
        dataIndex: 'validTo',
        // render: (value, row, index) => {
        //   return (
        //     <DatePicker
        //       disabled={readOnly}
        //       size="small"
        //       value={value ? moment(value): null}
        //       onChange={e => {
        //         handleChange('validTo', index, e)
        //       }}
        //     />
        //   )
        // },
      },
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
      { mode !== 'create' && <Table {...tableProps} /> }
    </Modal>
  )
}

export default Form.create()(modal)
