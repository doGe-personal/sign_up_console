import React from 'react'
import { Button, Col, Popconfirm, Row, Table, Upload } from 'antd'
import styles from './EditableDataTable.less'
import SearchBar from './SearchBar'
import { dataUtils } from '../../utils'

const getRowClassName = (record, index) => {
  return index % 2 === 0 ? 'table-stripe-odd' : ''
}

class EditableDataTable extends React.Component {
  onAddItem = () => {
    const { ...tableProps } = this.props
    let newData = {}
    tableProps.columns.forEach(item => {
      newData[item.dataIndex] = null
    })
    newData.id = dataUtils.getRandomInt(-99999999, -1)
    // newData.id = ''

    this.props.dispatch({
      type: `${this.props.domain}/addRow`,
      payload: { ...newData },
    })

    // this.setState({
    //   pagination: { ...pagination, total: newTotal },
    // })
  }
  onDeleteItems = () => {
    this.state.selectedRowKeys.forEach(id => {
      this.props.dispatch({
        type: `${this.props.domain}/deleteRow`,
        payload: id,
      })
    })

    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    })
  }
  onEditItem = () => {
    this.props.dispatch({
      type: `${this.props.domain}/getSingle`,
      payload: {
        mode: 'update',
        id: this.state.selectedRowKeys[0],
      },
    })
  }
  onViewItem = () => {
    this.props.dispatch({
      type: `${this.props.domain}/getSingle`,
      payload: {
        mode: 'view',
        id: this.state.selectedRowKeys[0],
      },
    })
    // this.setState({
    //   selectedRowKeys: [],
    // })
  }
  onCopyItem = () => {
    const { dataSource } = this.props
    const { selectedRowKeys } = this.state

    selectedRowKeys.forEach(id => {
      let newData = dataSource.filter(it => it.id === id)[0]

      newData = Object.assign({}, newData, { id: dataUtils.getRandomInt(-99999999, -1) })

      // console.log(newData)

      this.props.dispatch({
        type: `${this.props.domain}/addRow`,
        payload: { ...newData },
      })
    })
  }
  onFilterChange = value => {
    const { fetchData } = this.state
    this.setState(
      {
        fetchData: {
          offset: 0, // 回到第一页
          limit: fetchData.limit,
          sortBy: fetchData.sortBy,
          sortDirection: fetchData.sortDirection,
          ...value,
        },
      },
      () => {
        this.fetchList()
      },
    )
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = this.state.pagination

    pager.current = pagination.current

    // pager.total = this.props.total

    this.setState(
      {
        pagination: pager,
        fetchData: {
          limit: pagination.pageSize,
          offset: (pagination.current - 1) * pagination.pageSize,
          sortBy: sorter.field || 'id',
          sortDirection: sorter.order === 'descend' ? 'DESC' : 'ASC',
          ...filters,
        },
      },
      () => {
        this.fetchList()
      },
    )
  }

  fetchList = () => {
    this.props.dispatch({
      type: `${this.props.domain}/query`,
      payload: this.state.fetchData,
    })
  }
  renderHeader = () => {
    const { selectedRowKeys, selectedRows } = this.state
    const { size, loading, showAdd, showCopy, showDelete, readOnly, buttons } = this.props

    if (readOnly) {
      return null
    }
    return (
      <Row>
        {showAdd !== false && (
          <Col span={1}>
            <Button key="add" type="primary" size={size} onClick={this.onAddItem}>
              新增
            </Button>
          </Col>
        )}
        {selectedRowKeys.length > 0 && [
          showCopy !== false && (
            <Col span={1} style={{ marginLeft: 8 }}>
              <Button key="copy" type="primary" size={size} style={{ marginLeft: 8 }} onClick={this.onCopyItem}>
                复制
              </Button>
            </Col>
          ),
          <Popconfirm key="delete" title={'确定要删除这些记录么?'} placement="top" onConfirm={this.onDeleteItems}>
            {showDelete !== false && (
              <Col span={1} style={{ marginLeft: 13 }}>
                <Button
                  type="primary"
                  size={size}
                  loading={loading.effects[`${this.props.domain}/delete`]}
                >
                  删除
                </Button>
              </Col>
            )}
          </Popconfirm>,
        ]}
        {buttons &&
        buttons.map(b => {
          if (b.requiredSelected === 1 && selectedRowKeys.length === 1) {
            return (
              !b.hidden && (
                <Col span={1}>
                  <Button
                    size={size}
                    key={b.key}
                    type={b.type}
                    onClick={() => {
                      b.cb(selectedRowKeys, selectedRows)
                      this.setState({
                        selectedRowKeys: [],
                        selectedRows: [],
                      })
                    }}
                    style={{ marginLeft: 8 }}
                    loading={b.loading}
                  >
                    {b.name}
                  </Button>
                </Col>
              )
            )
          } else if (b.requiredSelected === 2 && selectedRowKeys.length >= 1) {
            return (
              !b.hidden && (
                <Col span={1}>
                  <Button
                    size={size}
                    key={b.key}
                    type={b.type}
                    onClick={() => {
                      b.cb(selectedRowKeys, selectedRows)
                      this.setState({
                        selectedRowKeys: [],
                        selectedRows: [],
                      })
                    }}
                    style={{ marginLeft: 8 }}
                    loading={b.loading}
                  >
                    {b.name}
                  </Button>
                </Col>
              )
            )
          } else if (b.requiredSelected === 0) {
            return (
              !b.hidden && (
                <Col span={1}>
                  <Button
                    size={size}
                    key={b.key}
                    type={b.type}
                    onClick={() => b.cb(selectedRowKeys, selectedRows)}
                    style={{ marginLeft: 8 }}
                    loading={b.loading}
                  >
                    {b.name}
                  </Button>
                </Col>
              )
            )
            // return (<Upload {...b.uploadProps}>
            //   <Button
            //     key={b.key}
            //     type={b.type}
            //     style={{ marginLeft: 8 }}
            //     loading={b.loading}
            //   >{b.name}</Button>
            // </Upload>);
          } else if (b.ftype && b.ftype === 'upload') {
            return (
              <Col span={2}>
                <Upload {...b.uploadProps} style={{ marginLeft: 8 }}>
                  <Button
                    size={size}
                    key={b.key}
                    type={b.type}
                    style={{ marginLeft: 6 }}
                    loading={b.loading}
                  >{b.name}</Button>
                </Upload>
              </Col>
            )
          } else if (b.ftype && b.ftype === 'download') {
            return (
              <Col span={2} style={{ marginLeft: 8 }}>
                <Button
                  size={size}
                  key={b.key}
                  type={b.type}
                  style={{ marginLeft: 6 }}
                  onClick={() => b.cb()}
                  loading={b.loading}
                >{b.name}</Button>
              </Col>
            )
          }
          return 0
        })}
        {
          <span key="stat" style={{ fontSize: 13, marginLeft: 12 }}>
            选择了 {selectedRowKeys.length} 条记录
          </span>
        }
      </Row>
    )
  }

  constructor(props) {
    super(props)
    const { size } = props

    this.state = {
      fetchData: {
        offset: 0,
        limit: 10,
      },
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: size === 'small' ? ['5', '10', '20', '50'] : ['10', '20', '30', '50', '100'],
        showTotal: total => `共 ${total} 条`,
        defaultPageSize: size === 'small' ? 5 : 10,
        defaultCurrent: 0,
        // current: 0,
        total: this.props.total,
      },
    }
  }

  render() {
    const {
      dataSource,
      readOnly,
      loading,
      domain,
      size,
      scroll,
      filter,
      columns,
      enableSelection,
      rowKey,
      rowSelection,
      onFieldsChange,
      ...tableProps
    } = this.props
    const { pagination, selectedRowKeys } = this.state

    pagination.total = this.props.total

    const elRowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows,
        })
      },
    }

    columns.forEach(col => {
      col.required &&
      typeof col.title === 'string' &&
      (col.title = <span className="ant-form-item-required">{col.title}</span>)

      // console.log(col.render)
      ;(readOnly && col.readOnly) &&
      (col.render = (value, row, index) => {
        return <span>{value}</span>
      })
    })

    return (
      <div>
        {filter &&
        !!filter.length && (
          <SearchBar size={size} domain={domain} onFilterChange={this.onFilterChange} filter={filter} />
        )}

        <Table
          loading={loading.effects[`${domain}/query`]}
          footer={enableSelection === false ? null : this.renderHeader}
          scroll={scroll}
          className={styles.table}
          bordered={true}
          rowKey={rowKey || 'id'}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowClassName={getRowClassName}
          rowSelection={enableSelection === false ? null : { ...elRowSelection, ...rowSelection }}
          {...tableProps}
        />
      </div>
    )
  }
}

export default EditableDataTable
