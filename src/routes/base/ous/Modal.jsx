import React from 'react'
import { Button, Col, Form, Input, Modal, Row } from 'antd'
import { SuggestSelect, UdcSelect } from '../../../components'

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
  onOk,
  onCancel,
  onOuChange,
  ouType,
  dispatch,
  loading,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const items = [
    {
      title: '类型',
      dataIndex: 'ouType',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <UdcSelect disabled={mode === 'view'} onChange={onOuChange} domain="ous" code="ou_type" />,
    },
    {
      title: '所属经销商',
      dataIndex: 'orgCode',
      options: {
        rules: [
          {
            required: ouType === '1',
            message: '必填',
          },
        ],
      },
      tag: <SuggestSelect disabled={mode === 'view'} params={{ ouType: '0' }} optionKey="code" apiName="orgs"
        showCode="true" />,
    },
    {
      title: '编码',
      dataIndex: 'ouCode',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <Input disabled={mode === 'view'} />,
    },
    {
      title: '名称',
      dataIndex: 'ouName',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <Input disabled={mode === 'view'} />,
    },
    {
      title: '电话',
      dataIndex: 'mobile',
      options: {
        rules: [
          {
            required: false,
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请录入正确的手机号码',
          },
        ],
      },
      tag: <Input disabled={mode === 'view'} />,
    },
    {
      title: '省',
      dataIndex: 'province',
      options: {
        rules: [
          {
            required: true,
          },
        ],
      },
      tag: <Input disabled={mode === 'view'} />,
    }, {
      title: '市',
      dataIndex: 'city',
      options: {
        rules: [
          {
            required: true,
          },
        ],
      },
      tag: <Input disabled={mode === 'view'} />,
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
    </Modal>
  )
}

export default Form.create()(modal)
