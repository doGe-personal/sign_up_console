import React from 'react'
import { connect } from 'dva'
import { Button, Col, Form, Icon, Input, message, Row } from 'antd'
import { config } from '../../../utils'
import styles from './forgetPW.less'

const { footerText } = config

const FormItem = Form.Item

const ForgetPW = ({
  forgetPW,
  dispatch,
  form: {
    getFieldDecorator,
    getFieldsValue,
  },
}) => {
  const { captcha } = forgetPW

  const handleOk = (e) => {
    e.preventDefault()
    const values = getFieldsValue()

    if (values.code === undefined || values.code === '') {
      message.error('员工号')
      return 0
    }
    if (values.captcha === undefined || values.captcha === '') {
      message.error('验证码必填')
      return 0
    }
    dispatch({ type: 'forgetPW/resetPW', payload: values })
  }

  const handleReturn = () => {
    dispatch({ type: 'forgetPW/return' })
  }

  const itemStyle = {
    width: '100%',
    height: 45,
    marginBottom: 6,
  }

  const iconStyle = { color: 'rgba(0,0,0,.25)', fontSize: 28 }


  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.logo}>
          <h1>重 置 密 码</h1>
        </div>
        <Form className={styles.form} onSubmit={handleOk}>
          <FormItem>
            {getFieldDecorator('code', {
              rules: [],
            })(<Input prefix={<Icon type="user" style={iconStyle} />} style={itemStyle} placeholder="员工号" />)}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('captcha', {
                  rules: [],
                })(
                  <Input prefix={<Icon type="lock" style={iconStyle} />} style={itemStyle} placeholder="验证码" />,
                )}
              </Col>
              <Col span={12}>
                <img src={captcha} alt="captcha" className={styles.captcha} />
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button type="primary" style={itemStyle} htmlType="submit">
              提交
            </Button>
          </FormItem>
          <Row>
            <Row className={styles.forgetPW}>
              <a onClick={handleReturn}>
                返回登录页
              </a>
              {/*<a style={{ width: '40%' }} href="./forgetPW">忘记密码</a>*/}
            </Row>

          </Row>
        </Form>
      </div>
      <div className={styles.footer}>
        {footerText}
      </div>
    </div>
  )
}


export default connect(({ forgetPW }) => ({ forgetPW }))(Form.create()(ForgetPW))
