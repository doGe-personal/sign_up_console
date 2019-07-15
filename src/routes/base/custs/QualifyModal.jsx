import React from 'react'
import { Button, Card, Col, Form, Input, Modal, Row } from 'antd'

const FormItem = Form.Item
const { Meta } = Card
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
  onEdit,
  dispatch,
  loading,
  editQulVisble,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const items = [
    {
      title: '牌照号码',
      dataIndex: 'plateNo',
      tag: <Input disabled={editQulVisble} />,
    },
    {
      title: '车辆类型',
      dataIndex: 'carType',
      tag: <Input disabled={editQulVisble} />,
    }, {
      title: '所有人',
      dataIndex: 'carOw',
      tag: <Input disabled={editQulVisble} />,
    }, {
      title: '住址',
      dataIndex: 'carOwAddr',
      tag: <Input disabled={editQulVisble} />,
    }, {
      title: '使用性质',
      dataIndex: 'usedFor',
      tag: <Input disabled={editQulVisble} />,
    }, {
      title: '品牌型号',
      dataIndex: 'spec',
      tag: <Input disabled={editQulVisble} />,
    }, {
      title: '车辆识别代码',
      dataIndex: 'carIdentifyCode',
      tag: <Input disabled={editQulVisble} />,
    }, {
      title: '发动机号码',
      dataIndex: 'engineCode',
      tag: <Input disabled={editQulVisble} />,
    }, {
      title: '注册日期',
      dataIndex: 'regTime',
      tag: <Input disabled={editQulVisble} />,
    }, {
      title: '发证日期',
      dataIndex: 'licTime',
      tag: <Input disabled={editQulVisble} />,
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

  const handleEdit = () => {
    onEdit()
  }

  const modalOpts = {
    ...modalProps,
    onCancel: handleCancel,
    footer: [
      <Button key="back" onClick={handleCancel}>
        取消
      </Button>,
      !editQulVisble && (
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

  const handleClickPhoto = () => {
    dispatch({
      type: `${domain}/showViewModal`,
    })
  }

  return (
    <Modal {...modalOpts}>
      <Card
        hoverable
        style={{ width: '50%', margin: '10px auto' }}
        cover={<div onClick={handleClickPhoto}><img style={{ maxHeight: 280 }} alt="example" src={`data:image/jpg;base64,${record.imageStr}`} /></div>}
      >
        <Meta
          description="行驶证图片"
        />
      </Card>
      <Row type="flex" justify="start">
        {items.map(item => renderItem(item))}
      </Row>
      <Row type="flex" justify="start">
        <Col span={2} offset={11}>
          <Button icon="edit" type="primary" onClick={handleEdit}>{editQulVisble ? '编辑' : '取消'}</Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(modal)
