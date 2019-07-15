import React from 'react'
import { connect } from 'dva'
import { Button, Form, Input, message, Row } from 'antd'
import styles from './changePW.less'
import { Page } from '../../../components'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

const ChangePW = ({
  changePW,
  dispatch,
  form: {
    setFieldsValue,
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      if (values.newPwd !== values.newPwd2) {
        message.error('两次密码不一致', 3)
        return
      }
      dispatch({ type: 'changePW/changePW', payload: values })
      setFieldsValue({ oldPwd: '', newPwd: '', newPwd2: '' })
    })
  }

  return (
    <Page inner>
      <Form className={styles.form}>
        <FormItem label="旧密码" {...formItemLayout}>
          {getFieldDecorator('oldPwd', {
            rules: [
              {
                required: true,
                message: '请输入旧密码',
              },
            ],
          })(<Input type="password" />)}
        </FormItem>

        <FormItem label="新密码" {...formItemLayout}>
          {getFieldDecorator('newPwd', {
            rules: [
              {
                required: true,
                message: '请输入新密码',
              },
            ],
          })(<Input type="password" />)}
        </FormItem>

        <FormItem label="确认新密码" {...formItemLayout}>
          {getFieldDecorator('newPwd2', {
            rules: [
              {
                required: true,
                message: '请再次输入新密码',
              },
            ],
          })(<Input type="password" />)}
        </FormItem>

        <Row>
          <Button type="primary" onClick={handleOk} loading={null}>
            修改密码
          </Button>
        </Row>
      </Form>
    </Page>
  )
}

export default connect(({ changePW }) => ({ changePW }))(Form.create()(ChangePW))
