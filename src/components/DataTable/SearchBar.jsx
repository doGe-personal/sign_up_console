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
    // marginBottom: 16,
  },
}

const Filter = ({
  onFilterChange,
  onFetchForm,
  filter,
  showReset,
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
    // console.log(fields);
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      const theFilter = filter.find(f => f.dataIndex === item)
      if (Object.prototype.hasOwnProperty.call(fields, item)) {
        if (theFilter && theFilter.tag && theFilter.tag.props.disabled) {
          // 忽略disabled的组件
        } else {
          const f = getFieldInstance(item)
          f.clear && f.clear()

          if (fields[item] instanceof Array) {
            fields[item] = []
          } else {
            fields[item] = undefined
          }
        }
      }
    }
    setFieldsValue(fields)
    handleSearch()
  }

  const handleChange = (key, e) => {
    let fields = getFieldsValue()
    fields[key] = e.target.value
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
    colon: false,
  }

  const renderItem = item => {
    if (item.tag) {
      // item.filter.tag.onPressEnter = handleSearch
      item.tag = React.cloneElement(item.tag, {
        // size: 'large',
        // ref: item.dataIndex,
        onChange: item.searchOnChange ? handleChange.bind(this, item.dataIndex) : null,
      })
    }

    return (
      <Col key={item.dataIndex} {...ColProps} {...item.colProps}>
        <FormItem {...formItemLayout} {...item.formItemLayout} label={item.title}>
          {getFieldDecorator(item.dataIndex, { ...item.options })(item.tag || <Input onPressEnter={handleSearch} />)}
        </FormItem>
      </Col>
    )
  }

  return (
    <Row gutter={4}>
      <Col span={20}>
        <Form>
          {/*<Row type="flex">*/}
          {filter.map(item => renderItem(item))}
          {/*</Row>*/}
        </Form>
      </Col>

      {filter &&
      filter.length && (
        <Col span={4} style={{ marginBottom: 6, paddingLeft: '2%' }}>
          <div style={{ textAlign: 'center', paddingTop: 5, float: 'right' }}>
            <Button shape="circle" icon="search" onClick={handleSearch} style={{ marginBottom: 10, marginRight: 5 }} />
            {showReset !== false && <Button shape="circle" icon="sync" onClick={handleReset} />}
            {/* <Button size="large" type="ghost" onClick={onAdd}>新增</Button>*/}
          </div>
        </Col>
      )}
    </Row>
  )
}

Filter.propTypes = {
  // onAdd: PropTypes.func,
  form: PropTypes.object.isRequired,
  filter: PropTypes.array.isRequired,
  onFilterChange: PropTypes.func,
}

export default Form.create({
  onFieldsChange(props, field) {
    // console.log(field);
  },
  onValuesChange(props, values) {
    // console.log('values', values);
    props.onFetchForm(values)
  },
})(Filter)
