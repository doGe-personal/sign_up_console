import React from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Form, Input, Modal, Row } from 'antd'
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
  onOk,
  onCancel,
  dispatch,
  loading,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const items = [
    {
      title: '姓名',
      dataIndex: 'userName',
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
      title: '邮箱',
      dataIndex: 'email',
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
      title: '对应员工',
      dataIndex: 'empId',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <UdcSelect disabled={readOnly} domain="BASE" code="OU_TYPE" />,
    },
    {
      title: '角色',
      dataIndex: 'bussPlace',
      options: {
        initialValue: '1',
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
      title: '状态',
      dataIndex: 'userStatus',
      options: {
        initialValue: '1',
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <UdcSelect disabled={readOnly} domain="BASE" code="OU_STATUS" />,
    },
  ]

  const handleOk = () => {
    if (mode === 'view') {
      onOk({})
      return 0
    }
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
    // onOk: handleOk,
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

modal.propTypes = {
  readOnly: PropTypes.bool,
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  record: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
