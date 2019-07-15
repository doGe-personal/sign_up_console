import React from 'react'
import debounce from 'lodash.debounce'
import { Select, Spin } from 'antd'
import { config, networkUtils } from '../../utils'

const { api } = config
const { suggest } = api.common
const Option = Select.Option

class SuggestSelect extends React.Component {
  constructor(props) {
    super(props)
    const { value, params, mode } = this.props
    if (mode === 'multiple') {
      let v = value && value.length > 0 ? value.join(',').split(',') : value
      this.state = {
        value: v,
        dataSource: [],
      }
    } else {
      this.state = {
        // value: (value && '' + value) || null,
        params,
        value: value === null ? null : value === undefined ? null : '' + value,
        dataSource: [],
        fetching: false,
      }
      this.fetchData = debounce(this.fetchData, 800)
    }
  }

  componentDidMount = () => {
    this.fetchData()
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    // console.log(nextProps.value, this.state.value);
    if (nextProps.mode === 'multiple') {
      this.setState({
        value: nextProps.value && nextProps.value.length > 0 ? nextProps.value.join(',').split(',') : nextProps.value,
      })
    } else {
      if (nextProps.value + '' !== this.state.value) {
        this.setState({
          value: nextProps.value ? nextProps.value + '' : null,
        })
      }
    }
  }

  fetchData = params => {
    const { apiName } = this.props
    if (suggest[apiName] === undefined) {
      console.log(`${apiName} api定义未找到`)
      return 0
    }
    // console.log(this.props.params)
    // if (params.key === '' || params.key === ' ') return 0
    this.setState({ fetching: true })
    networkUtils
      .request({
        method: 'get',
        url: suggest[apiName],
        data: { ...params, ...this.props.params },
      })
      .then(data => {
        if (data.success) {
          this.setState({
            dataSource: data.data,
            fetching: false,
          })
        } else {
          throw data
        }
        // localStorage.setItem('suggest' + '_' + this.props.apiName, JSON.stringify(data.data))
      })
    return 0
  }

  //
  // componentWillReceiveProps = (nextProps) => {
  //   const { value } = nextProps

  // console.log('ss', nextProps)
  // this.state = {
  //   value,
  //     value: value === null ? null : (value === undefined ? null : '' + value),
  //     //   ...props
  // }
  // }
  handleChange = (value, option) => {
    if (this.props.mode === 'multiple') {
      this.props.onChange(value ? value.filter(val => val !== null) : value)
      this.setState({
        value: value ? value.filter(val => val !== null) : value,
        fetching: false,
      })
    } else {
      this.props.onChange(value, option.props.title)
      this.setState({
        value: value,
        fetching: false,
        // dataSource: [],
      })
    }
  }

  handleSelect = (value, option) => {
    this.props.onChange(value)
    this.setState({
      value: value,
      fetching: false,
      // dataSource: [],
    })
  }
  handleSearch = value => {
    this.fetchData({ key: value })
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
  onFoucus = () => {
    const { params } = this.props
    params && this.fetchData(params)
  }

  render() {
    const { dataSource, fetching, value } = this.state
    const { disabled, size, showCode, mode, optionKey } = this.props
    // console.log(value, mode);
    return (
      <Select
        onFocus={this.onFoucus}
        disabled={disabled}
        showSearch={true}
        value={value}
        defaultActiveFirstOption={false}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        size={size}
        style={{ width: '100%' }}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        optionLabelProp="children"
        getPopupContainer={() => document.getElementById('centerContainer')}
        mode={mode}
      >
        <Option style={{ display: mode === 'multiple' ? 'none' : '' }} key={0} title="空" value={null}>
          请选择
        </Option>
        {dataSource &&
        dataSource.map(d => (
          <Option key={optionKey === 'code' ? d.code : d.id} title={d.name}>
            {showCode && `(${d.code})`} {d.name}
          </Option>
        ))}
      </Select>
    )
  }
}

export default SuggestSelect
