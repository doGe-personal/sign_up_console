import React from 'react'
import { Button, Col, Form, Input, Modal, Row } from 'antd'
import { SuggestSelect } from '../../../components'

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
      title: '登录名称',
      dataIndex: 'login',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <Input disabled={mode !== 'create'} />,
    },
    {
      title: '用户名称',
      dataIndex: 'name',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <Input disabled={mode !== 'create'} />,
    },
    {
      title: '授权角色',
      dataIndex: 'roles',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <SuggestSelect disabled={readOnly || record.type === 'admin'} apiName="roles" />,
    },
    {
      //   title: '流程角色',
      //   dataIndex: 'bpmRoles',
      //   tag: <SuggestSelect disabled={readOnly} apiName="bpmRoles" mode="multiple"/>,
      // }, {
      title: '邮箱',
      dataIndex: 'email',
      options: {
        rules: [
          {
            // required: true,
            pattern: /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
            message: '请录入正确的邮件编码',
          },
        ],
      },
      tag: <Input disabled={readOnly} />,
    },
    {
      title: '手机',
      dataIndex: 'phone',
      options: {
        rules: [
          {
            // required: true,
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请录入正确的手机号码',
          },
        ],
      },
      tag: <Input disabled={readOnly} />,
      // }, {
      //   title: '用户领域',
      //   dataIndex: 'field',
      //   options: {
      //     initialValue: 'EO',
      //     rules: [{
      //       required: true,
      //       message: '必填',
      //     }],
      //   },
      //   tag: <UdcSelect domain="EDP" code="AUTH_FIELD"/>,
    },
  ]

  const handleOk = () => {
    validateFields(errors => {
      if (errors) {
        return
      }
      const formData = getFieldsValue()
      let data = {
        ...formData,
        roles: Array.isArray(formData.roles) ? formData.roles : [formData.roles],
      }
      if (mode === 'create') {
        data.password = 'password'
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
