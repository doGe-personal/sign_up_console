import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Affix,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Row,
  Upload,
} from 'antd'
import styles from '../../../themes/signup.less'
import { config } from '../../../utils'

const { api, baseURL } = config
const { ei } = api
const { streamDownload } = ei

const FormItem = Form.Item
const ColProps = {
  xs: 12,
  sm: 12,
  md: 6,
  xl: 12,
  style: {},
}
const { RangePicker } = DatePicker
const FormItemLayout = {
  colon: false,
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
  style: {
    // marginBottom: 20,
  },
}
const RadioGroup = Radio.Group

const ActForm = ({
  record,
  readOnly,
  limitReadOnly,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  },
  onOk,
  onUploadCoverImg,
  onUploadIconImg,
  onGoBack,
}) => {
  let actTime = []
  if (record && record.beginTime && record.endTime) {
    actTime.push(moment(record.beginTime))
    actTime.push(moment(record.endTime))
  }

  const hanleUploadCoverImg = ({ data, file, filename }) => {
    const formData = new FormData()
    formData.append('file', file)
    onUploadCoverImg(formData)
  }

  const handleSave = (e) => {
    e.preventDefault()
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        onOk()
      }
    })
  }

  const handleGoBack = () => {
    onGoBack()
  }
  const items = [
    {
      title: '活动标题',
      dataIndex: 'title',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <Input disabled={readOnly} placeholder="请输入活动标题" />,
    },
    {
      title: '活动时间',
      dataIndex: 'actTime',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
        initialValue: actTime,
      },
      tag: <RangePicker disabled={readOnly} />,
    },
    {
      title: '领奖截止日期',
      dataIndex: 'acceptEndTime',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
      },
      tag: <DatePicker disabled={readOnly} style={{ width: '100%' }} />,
    },
    {
      title: '主题图',
      dataIndex: 'iconImgList',
      options: {
        rules: [
          {
            required: false,
            message: '必填',
          },
        ],
      },
      tag: <Upload
        style={{ width: '100%' }}
        name="主题图片"
        accept="image/*"
        listType="picture"
        customRequest={hanleUploadCoverImg.bind(this)}
        showUploadList={false}
      >
        <Button disabled={readOnly}>
          <Icon type="upload" /> {record.coverImg ? '已上传' : '点击上传'}
        </Button>
        （建议：高:350,宽:750）
      </Upload>,
    },
    {
      title: '购买限制',
      dataIndex: 'limitFlag',
      options: {
        rules: [
          {
            required: true,
            message: '必填',
          },
        ],
        initialValue: '0',
      },
      tag: <RadioGroup disabled={readOnly}>
        <Radio value="1">有</Radio>
        <Radio value="0">无</Radio>
      </RadioGroup>,
    }, {
      title: '限制',
      dataIndex: 'limitQty',
      options: {
        rules: [
          {
            required: !limitReadOnly,
            message: '必填',
          },
        ],
      },
      tag: <div>
        <InputNumber disabled={limitReadOnly || readOnly} min={0} />
        <span style={{ marginLeft: 8 }}> 件</span>
      </div>
      ,
    },
  ]
  const renderItem = (item) => {
    return (
      <Col key={item.dataIndex} {...ColProps} {...item.colItemLayout}>
        <FormItem
          label={item.title}
          {...FormItemLayout}
          {...item.formItemLayout}
        >
          {getFieldDecorator(item.dataIndex, {
            ...item.options,
            initialValue: item.tag !== undefined && (item.dataIndex === 'acceptEndTime') ? moment(record[`${item.dataIndex}`] || (item.options && item.options.initialValue)) : record[`${item.dataIndex}`] || (item.options && item.options.initialValue),
          })(item.tag)}
        </FormItem>
      </Col>
    )
  }
  const uploadButton = (
    <div className={styles.act_upload_text}>
      <Icon type={record.coverImgUploading ? 'loading' : 'plus'} />
      <div>添加封面图</div>
      <div style={{ color: 'red', display: 'inline-block' }}>建议(高:140,宽:140)</div>
    </div>
  )
  const hanleUploadIconImg = ({ data, file, filename }) => {
    const formData = new FormData()
    formData.append('file', file)
    onUploadIconImg(formData)
  }

  return (
    <div className={styles.act_form}>
      <Affix
        offsetTop={10}
      >
        <Card className={styles.act_form_title}>
          <Row>
            <Col span={22}>
              {!readOnly && <Button type="primary"
                onClick={handleSave}
                htmlType="submit">
                <Icon type="save" theme="outlined" />保存
              </Button>
              }
            </Col>
            <Col span={1}>
              <Popconfirm
                title="确定要返回吗？"
                okText="是"
                cancelText="否"
                onConfirm={handleGoBack.bind(this, record)}
              >
                <Button icon="rollback">返回</Button>
              </Popconfirm>
            </Col>
          </Row>
        </Card>
      </Affix>
      <Card title="基本信息" className={styles.act_form_base}>
        <Row type="flex" justify="start">
          <Col span={2} sm={5}>
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={hanleUploadIconImg.bind(this)}
              accept="image/*"
              disabled={readOnly}
            >
              {record.iconImg ?
                <img
                  style={{ width: '100%' }} src={`${baseURL}/${streamDownload.replace('{file}', record.iconImg)}`}
                  alt="封面图"
                /> : uploadButton}
            </Upload>
          </Col>
          <Col span={18} sm={18}>
            {items.map(item => renderItem(item))}
          </Col>
        </Row>
      </Card>
    </div>
  )
}

ActForm.propTypes = {
  form: PropTypes.object,
  record: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
}

export default Form.create({
  mapPropsToFields(props) {

  },
  onFieldsChange(props, field) {

  },
  onValuesChange(props, values) {
    // if (values.limitFlag === '0') {
    //   props.onFieldsChange({ limitQty: '0' })
    // }
    props.onFieldsChange(values)
  },
})(ActForm)
