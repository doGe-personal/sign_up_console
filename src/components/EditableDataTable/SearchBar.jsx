import React from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Form, Input, Row } from 'antd'

const FormItem = Form.Item
// const Search = Input.Search
// const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 8,
  xl: 8,
  style: {
    // marginBottom: 6,
  },
}

const Filter = ({
  onFilterChange,
  filter,
  size,
  form: { getFieldDecorator, getFieldsValue, setFieldsValue, getFieldInstance, getFieldProps, resetFields },
}) => {
  const handleFields = fields => {
    let updatedFileds = {}

    for (const prop in fields) {
      // Convert moment obj to 'YYYY-MM-DD'
      if (Object.prototype.toString.call(fields[`${prop}`]) === '[object Array]') {
        // console.log(prop, fields[`{prop}]`, typeof fields[`{prop}]`, fields[`{prop}]`[0].format('YYYY-MM-DD'))
        // console.log(fields[`{prop}]`)
        if (prop.substr(prop.length - 4, 4) === 'Date') {
          updatedFileds[`${prop}From`] = fields[`${prop}`][0] && fields[`${prop}`][0].format('YYYY-MM-DD')
          updatedFileds[`${prop}To`] = fields[`${prop}`][1] && fields[`${prop}`][1].format('YYYY-MM-DD')
        } else if (prop.substr(prop.length - 4, 4) === 'Time') {
          updatedFileds[`${prop}From`] = fields[`${prop}`][0] && fields[`${prop}`][0].format('YYYY-MM-DDTHH:mm:ss')
          updatedFileds[`${prop}To`] = fields[`${prop}`][1] && fields[`${prop}`][1].format('YYYY-MM-DDTHH:mm:ss')
        } else {
          // 处理多级联动
          updatedFileds[prop] = fields[prop]
        }
      } else if (prop.substr(prop.length - 4, 4) === 'Date') {
        updatedFileds[`${prop}`] = fields[`${prop}`] && fields[`${prop}`].format('YYYY-MM-DD')
      } else if (prop.substr(prop.length - 4, 4) === 'Time') {
        updatedFileds[`${prop}`] = fields[`${prop}`] && fields[`${prop}`].format('YYYY-MM-DDTHH:mm:ss')
      } else {
        updatedFileds[prop] = fields[prop]
      }
    }
    return updatedFileds
  }

  const handleSearch = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        const f = getFieldInstance(item)
        f.clear && f.clear()

        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSearch()
  }

  // const handleChange = (key, values) => {
  //   let fields = getFieldsValue()
  //   fields[key] = values
  //   fields = handleFields(fields)
  //   onFilterChange(fields)
  // }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    colon: false,
  }

  const renderItem = item => {
    if (item.tag) {
      // item.filter.tag.onPressEnter = handleSearch
      item.tag = React.cloneElement(item.tag, {
        size: size,
        // ref: item.dataIndex,
        // onChange: handleChange(item.dataIndex, '2'),
      })
    }

    return (
      <Col key={item.dataIndex} {...ColProps} {...item.colProps}>
        <FormItem {...formItemLayout} {...item.formItemLayout} label={item.title}>
          {getFieldDecorator(item.dataIndex, { ...item.options })(
            item.tag || <Input size={size} onPressEnter={handleSearch} />,
          )}
        </FormItem>
      </Col>
    )
  }

  return (
    <Row gutter={4}>
      <Row type="flex">{filter.map(item => renderItem(item))}</Row>

      <Col span={24} style={{ textAlign: 'right', marginBottom: size === 'small' ? 5 : 16 }}>
        <Button size={size} className="margin-right" shape="circle" icon="search" onClick={handleSearch} />
        <Button size={size} className="margin-right" shape="circle" icon="sync" onClick={handleReset} />
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  // onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.array,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
