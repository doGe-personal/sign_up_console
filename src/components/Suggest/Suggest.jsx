import React from 'react'
import debounce from 'lodash.debounce'
import { AutoComplete, Spin } from 'antd'
import { config, networkUtils } from '../../utils'

const { api } = config
const { suggest } = api.common
const Option = AutoComplete.Option

class Suggest extends React.Component {
  componentDidMount = () => {
    this.fetchData = debounce(this.fetchData, 800)
    this.fetchData()
  }
  fetchData = params => {
    // if (params.key === '' || params.key === ' ') return 0
    this.setState({ fetching: true })
    networkUtils.request({ method: 'get', url: suggest[this.props.apiName], data: params }).then(data => {
      if (data.success) {
        this.setState({
          dataSource: data.data,
          fetching: false,
        })
      } else {
        throw data.message
      }
    })
  }
  handleSelect = (value, option) => {
    // console.log(value)
    // console.log(option.props.text)
    // console.log(this.state);
    this.props.onChange(option.props.text)
    this.setState({
      value: option.props.text,
    })
    // console.log(this.state);
  }
  handleSearch = value => {
    this.props.onChange(value)
    this.setState({
      value,
      // dataSource: [],
      // fetching: false,
    })

    this.fetchData({ key: value })
  }
  renderOption = item => {
    const { showCode } = this.props
    return (
      <Option key={item.id} text={item.name}>
        {/*{item.code} - {item.name}*/}
        {item.name} {showCode && `(${item.code})`}
      </Option>
    )
  }
  onChange = value => {
    this.props.onChange(value)
    this.setState({
      value,
      fetching: false,
    })
  }
  clear = () => {
    this.setState({
      // dataSource: [],
      value: '',
    })
  }

  constructor(props) {
    super(props)
    const { value } = this.props
    this.state = {
      value: value || '',
      dataSource: [],
      fetching: false,
    }
  }

  render() {
    const { dataSource, fetching, value } = this.state
    const { disabled, size } = this.props

    return (
      <AutoComplete
        value={value}
        disabled={disabled}
        placeholder="请至少输入一个字符"
        size={size}
        style={{ width: '100%' }}
        // eslint-disable-next-line react/no-children-prop
        children={
          fetching ? (
            <Option key={'loading'}>
              <Spin size="small" />
            </Option>
          ) : (
            dataSource.map(this.renderOption)
          )
        }
        onSelect={this.handleSelect}
        onSearch={this.handleSearch}
        optionLabelProp="text"
        allowClear
        ref={input => (this.mainInput = input)}
      />
    )
  }
}

export default Suggest
