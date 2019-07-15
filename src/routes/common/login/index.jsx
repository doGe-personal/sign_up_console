import React from 'react'
import { connect } from 'dva'
import { Button, Col, Form, Icon, Input, Row, Spin } from 'antd'
// import loginBg from '../../../../public/assets/img/loginBg.jpg'
// import { config } from '../../../utils';
// const { footerText } = config;

const FormItem = Form.Item

const Login = ({ login, loading, dispatch, form: { getFieldDecorator, validateFieldsAndScroll } }) => {
  const { loginLoading, captcha } = login

  const handleOk = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }

  const handleRefreshCaptcha = () => {
    dispatch({ type: 'login/getCaptcha' })
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: 'url(\'/assets/img/loginBg.jpg\')',
        backgroundSize: 'cover',
      }}
    >
      <div
        style={{
          width: 300,
          height: 330,
          padding: 36,
          position: 'absolute',
          margin: '-170px  0  0  -150px',
          top: '50%',
          left: '50%',
          borderRadius: 5,
          boxShadow: '0 0 100px rgba(0, 0, 0, .5)',
        }}
      >
        <FormItem>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
            ],
          })(<Input size="large" onPressEnter={handleOk} placeholder="用户名" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
            ],
          })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="密码" />)}
        </FormItem>
        <FormItem>
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请输入验证码' }],
              })(<Input placeholder="验证码" size="large" onPressEnter={handleOk} />)}
            </Col>
            <Col
              onClick={handleRefreshCaptcha}
              span={12}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                height: 36,
                cursor: 'pointer',
              }}
            >
              {loading.effects['login/getCaptcha'] ? (
                <Spin indicator={<Icon type="loading" spin />} />
              ) : (
                <img
                  src={captcha}
                  alt="captcha"
                  style={{
                    borderRadius: 3,
                    border: '1px solid #d9d9d9',
                    width: '100%',
                    height: 36,
                  }}
                />
              )}
            </Col>
          </Row>
        </FormItem>

        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loginLoading} style={{ width: '100%' }}>
            登录
          </Button>
        </Row>
        <br />
        {/* <Row>
          <div style={{ textAlign: 'center' }}>
            <span>用户名:admin </span>
            <span>密码:password</span>
          </div>
        </Row> */}
      </div>
    </div>
  )
}

export default connect(({ login, loading }) => ({ login, loading }))(Form.create()(Login))
