import React from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Form, Input, Modal, Row, Table } from 'antd'

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
  roles: { perms },
  onOk,
  onCancel,
  dispatch,
  loading,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const items = [
    {
      title: '角色名称',
      dataIndex: 'name',
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
  ]

  const handleOk = () => {
    validateFields(errors => {
      if (errors || !record.perms.length) {
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

  const tableProps = {
    scroll: { x: '100%', y: 400 },
    indentSize: 30,
    rowKey: 'code',
    dataSource: perms,
    bordered: true,
    defaultExpandAllRows: true,
    columns: [
      {
        title: '菜单名称',
        dataIndex: 'name',
        className: 'alignLeft',
        width: '35%',
      },
      {
        title: '菜单类型',
        dataIndex: 'type',
        className: 'alignLeft',
        width: '20%',
        render: (value, record, index) => ('M' === value ? '菜单页面' : '操作按钮'),
      },
      {
        title: '菜单APIs',
        dataIndex: 'apis',
        className: 'alignLeft',
        width: '40%',
      },
    ],
    rowSelection: {
      selectedRowKeys: record.perms,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: `${domain}/updatePerms`,
          payload: selectedRowKeys,
        })
      },
      getCheckboxProps: record => ({ disabled: mode === 'view' }),
    },
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
      <Table loading={loading.effects[`${domain}/query`]} pagination={false} size="small" {...tableProps} />
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
