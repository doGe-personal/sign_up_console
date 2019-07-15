import React from 'react'

import { Select } from 'antd'
import { config, networkUtils } from '../../utils'

const { api } = config
const { udc } = api.common
const Option = Select.Option

class UdcSelect extends React.Component {
  componentDidMount = () => {
    this.fetchData()
  }
  UNSAFE_componentWillReceiveProps = nextProps => {
    // console.log(nextProps.value, this.state.value);

    if (nextProps.mode === 'multiple') {
      this.setState({
        value: nextProps.value ? nextProps.value : [],
      })
      // if (nextProps.value !== this.state.value) {
      //   this.setState({
      //     value: nextProps.value ? nextProps.value + '' : null,
      //   });
      // }
    } else {
      if (nextProps.value + '' !== this.state.value) {
        this.setState({
          value: nextProps.value ? nextProps.value + '' : null,
        })
      }
    }
  }
  fetchData = params => {
    const { domain, code } = this.props
    this.setState({ fetching: true })

    const hit = JSON.parse(sessionStorage.getItem(`udc_${domain}_${code}`))

    if (hit) {
      this.setState({
        dataSource: hit,
      })
    } else {
      networkUtils.request({ method: 'get', url: udc.query.replace('{udc}', `${domain}.${code}`) }).then(data => {
        if (data.success) {
          this.setState({
            dataSource: data.data,
          })
          sessionStorage.setItem(`udc_${domain}_${code}`, JSON.stringify(data.data))
        } else {
          throw data.message
        }
      })
    }
  }
  // }
  handleSelect = (value, option) => {
    console.log(value)
    this.props.onChange(option.props.text)
    this.setState({
      value,
    })
  }

  // shouldComponentUpdate(nextProps) {
  // return isObjectEqual(this.props, nextProps);
  handleSearch = value => {
    this.fetchData({ key: value })
  }
  handleChange = value => {
    this.props.onChange(value)
    this.setState({
      value,
      fetching: false,
    })
  }
  clear = () => {
    if (this.props.mode === 'multiple') {
      this.setState({
        value: [],
      })
    } else {
      this.setState({
        value: '',
      })
    }
  }

  constructor(props) {
    super(props)
    const { value, mode } = this.props

    if (mode === 'multiple') {
      this.state = {
        value: value || [],
        dataSource: [],
      }
    } else {
      this.state = {
        value: value || '',
        dataSource: [],
      }
    }
  }

  render() {
    const { dataSource, value } = this.state
    const { disabled, allowClear, size, mode } = this.props
    // if (disabled) {
    //   return <span className="ant-form-text">{value}</span>
    // }
    return (
      <Select
        disabled={disabled}
        value={value}
        defaultActiveFirstOption={false}
        size={size}
        style={{ width: '100%' }}
        filterOption={false}
        onChange={this.handleChange}
        allowClear={allowClear}
        getPopupContainer={() => document.getElementById('centerContainer')}
        mode={mode}
      >
        {dataSource.map(d => (
          <Option key={d.code} title={d.name}>
            {d.name}
          </Option>
        ))}
      </Select>
    )
  }
}

export default UdcSelect
