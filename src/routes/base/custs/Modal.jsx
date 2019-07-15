import React from 'react'
import * as style from '../../../themes/signup.less'
import { Button, Col, Form, Icon, Input, Modal, Radio, Row, Upload } from 'antd'

const RadioGroup = Radio.Group
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
  onUploadQualify,
  handleShowImg,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const items = [
    {
      title: '客户名称',
      dataIndex: 'custName',
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
      title: '客户编码',
      dataIndex: 'custCode',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <Input disabled={true} />,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      options: {
        rules: [
          {
            required: false,
            message: '必填',
          },
        ],
      },
      tag: <RadioGroup disabled={readOnly}>
        <Radio value={1}>男</Radio>
        <Radio value={2}>女</Radio>
      </RadioGroup>,
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      options: {
        rules: [
          {
            required: true,
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请录入正确的手机号码',
          },
        ],
      },
      tag: <Input disabled={readOnly} />,
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

  const uploadButton = (
    <div>
      <Icon type={'plus'} />
      <div className="ant-upload-text">上传证照</div>
    </div>
  )

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
  const beforeUpload = (file) => {
    getBase64(file, imageUrl => {
      handleShowImg(imageUrl)
    })
    return true
  }
  const hanleUpload = ({ data, file, filename }) => {
    const formData = new FormData()
    formData.append('file', file)
    onUploadQualify(formData)
  }
  return (
    <Modal {...modalOpts}>
      {(mode === 'update' || mode === 'view') &&
      <Row>
        <Col offset={2}>
          <Upload
            name="avatar"
            disabled={!(mode === 'update')}
            listType="picture-card"
            showUploadList={false}
            accept="image/*"
            beforeUpload={beforeUpload}
            className={style.license_uploader}
            customRequest={hanleUpload.bind(this)}
          >
            {record.licenseImgStr ?
              <img style={{ width: '100%' }} src={`${record.licenseImgStr}`} alt="证照" /> : uploadButton}
          </Upload>
        </Col>
      </Row>
      }
      <Row type="flex" justify="start">
        {items.map(item => renderItem(item))}
      </Row>
    </Modal>
  )
}

export default Form.create()(modal)
