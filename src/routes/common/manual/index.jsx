import React from 'react'
import { connect } from 'dva'
import { Form } from 'antd'

// const FormItem = Form.Item
// const Option = Select.Option
//
// const formItemLayout = {
//   // colon: false,
//   labelCol: { span: 6 },
//   wrapperCol: { span: 16 },
// }
//
// const colProps = {
//   xs: 24,
//   sm: 24,
//   md: 12,
//   lg: 12,
//   xl: 12,
//   style: {},
// }

const Profile = ({
  userInfo,
  dispatch,
  form: {
    setFieldsValue,
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  // const { formData } = userInfo
  //
  // function handleOk() {
  //   dispatch({ type: 'userInfo/save' })
  // }

  return (
    <div className="content-inner">

    </div>
  )
}

export default connect(({ userInfo }) => ({ userInfo }))(Form.create()(Profile))
