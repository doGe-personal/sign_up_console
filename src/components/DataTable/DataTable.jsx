import React from 'react'
import { Button, Checkbox, Col, Dropdown, Menu, Popconfirm, Row, Table } from 'antd'
import styles from './DataTable.less'
import SearchBar from './SearchBar'

const getRowClassName = (record, index) => {
  return index % 2 === 0 ? 'table-stripe-odd' : ''
}

class DataTable extends React.Component {
  componentDidMount = () => {
    const { filter, disableFetch } = this.props
    const { fetchData } = this.state

    let iniFilter = []
    filter &&
    filter.forEach(f => {
      if (f.options && f.options.initialValue) {
        iniFilter.push({
          [f.dataIndex]: f.options.initialValue,
        })
      }
    })

    const newFetchData = Object.assign({}, fetchData, ...iniFilter)

    // console.log(newFetchData)

    this.setState(
      {
        fetchData: newFetchData,
      },
      () => {
        // withFetch && this.fetchList();
        !disableFetch && this.fetchList()
      },
    )
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    // console.log(nextProps.columns);
    this.setState({
      columns: nextProps.columns,
    })
  }

  onAddItem = () => {
    this.props.dispatch({
      type: `${this.props.domain}/getSingle`,
      payload: {
        mode: 'create',
      },
    })
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    })
  }
  onDeleteItems = () => {
    this.props.dispatch({
      type: `${this.props.domain}/delete`,
      payload: {
        ids: this.state.selectedRowKeys,
      },
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
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    })
  }
  onViewItem = () => {
    // const { dataSource } = this.props
    this.props.dispatch({
      type: `${this.props.domain}/getSingle`,
      payload: {
        mode: 'view',
        id: this.state.selectedRowKeys[0],
        // item: dataSource.filter(d => d.buzId === this.state.selectedRowKeys[0])[0]
      },
    })
    // this.setState({
    //   selectedRowKeys: [],
    // })
  }
  handleRowDoubleClick = (record, index) => {
    const rowKey = this.props.rowKey || 'id'
    this.props.dispatch({
      type: `${this.props.domain}/getSingle`,
      payload: {
        mode: 'view',
        id: record[rowKey],
        // item: dataSource.filter(d => d.buzId === this.state.selectedRowKeys[0])[0]
      },
    })
  }

  fetchSearchBarForm = formFields => {
    this.setState({
      searchBarForm: Object.assign({}, this.state.searchBarForm, formFields),
    })

    this.props.onFilterChange && this.props.onFilterChange(formFields)
  }

  onFilterChange = formFields => {
    const { fetchData, pagination } = this.state
    const { rowKey, sortBy, sortDirection } = this.props

    const pager = Object.assign({}, pagination)
    pager.current = 1 // 回到第一页

    // console.log(formFields)
    const newFetchData = Object.assign({}, fetchData, {
      offset: 0, // 回到第一页
      limit: fetchData.limit,
      sortBy: fetchData.sortBy || sortBy || rowKey,
      sortDirection: fetchData.sortDirection || sortDirection,
      ...formFields,
    })

    // console.log(formFields);

    this.setState(
      {
        pagination: pager,
        fetchData: newFetchData,
        selectedRowKeys: [],
        selectedRows: [],
      },
      () => {
        this.fetchList()
      },
    )
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = Object.assign({}, this.state.pagination)
    const { fetchData } = this.state
    const { rowKey, sortBy, sortDirection } = this.props

    pager.current = pagination.current

    const newFetchData = Object.assign({}, fetchData, {
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      sortBy: sorter.field || sortBy || rowKey,
      sortDirection: sorter.order === 'descend' ? 'DESC' : sorter.order === 'ascend' ? 'ASC' : sortDirection,
      ...filters,
    })

    this.setState(
      {
        pagination: pager,
        fetchData: newFetchData,
        selectedRowKeys: [],
        selectedRows: [],
      },
      () => {
        this.fetchList()
      },
    )
  }

  fetchList = () => {
    // console.log(this.state.fetchData);
    this.props.dispatch({
      type: `${this.props.domain}/query`,
      payload: this.state.fetchData,
    })
  }

  handleVisibleChange = flag => {
    // console.log(flag);
    this.setState({ colsSwitchVisible: flag })
  }

  handleColsSwitch = dataIndex => {
    const { columns } = this.state
    const newColumns = columns.slice()
    newColumns.forEach(c => {
      if (c.dataIndex === dataIndex) {
        if (c.visible || c.visible === undefined) {
          c.visible = false
        } else {
          c.visible = true
        }
        // console.log(c);
        this.setState({
          columns: newColumns,
        })
      }
    })
  }

  renderColsSwitch = cols => {
    return cols.map(col => {
      return (
        <Menu.Item key={col.dataIndex}>
          <Checkbox defaultChecked={col.visible || true} onChange={this.handleColsSwitch.bind(this, col.dataIndex)}>
            {col.title}
          </Checkbox>
        </Menu.Item>
      )
    })
  }

  renderHeader = () => {
    const { selectedRowKeys, selectedRows, searchBarForm, colsSwitchVisible } = this.state
    const {
      loading,
      showColumn,
      showAdd,
      showEdit,
      showView,
      showDelete,
      columns,
      buttons,
      handleMail,
      handlePrint,
      customBtn,
    } = this.props
    const menu = columns && <Menu>{this.renderColsSwitch(columns)}</Menu>

    return (
      <Row>
        <Col span={18}>
          {showAdd !== false && (
            <Button key="add" type="primary" onClick={this.onAddItem}>
              新增
            </Button>
          )}
          {selectedRowKeys.length > 0 && [
            selectedRowKeys.length === 1 && [
              showEdit !== false && (
                <Button key="edit" type="primary" style={{ marginLeft: 8 }} onClick={this.onEditItem}>
                  修改
                </Button>
              ),
              showView !== false && (
                <Button key="view" type="primary" style={{ marginLeft: 8 }} onClick={this.onViewItem}>
                  查看
                </Button>
              ),
            ],
            <Popconfirm key="pop" title={'确定要删除这些记录么?'} placement="left" onConfirm={this.onDeleteItems}>
              {showDelete !== false && (
                <Button
                  key="delete"
                  type="primary"
                  style={{ marginLeft: 8 }}
                  loading={loading.effects[`${this.props.domain}/delete`]}
                >
                  删除
                </Button>
              )}
            </Popconfirm>,
          ]}
          {buttons &&
          buttons.map(b => {
            if (b.hidden) return null
            if (b.requiredSelected === 1 && selectedRowKeys.length === 1) {
              return (
                <Button
                  key={b.key}
                  disabled={b.disabled}
                  type={b.type}
                  onClick={() => {
                    b.cb(selectedRowKeys, searchBarForm, selectedRows)
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
              )
            } else if (b.requiredSelected === 2 && selectedRowKeys.length >= 1) {
              return (
                <Button
                  key={b.key}
                  disabled={b.disabled}
                  type={b.type}
                  onClick={() => {
                    b.cb(selectedRowKeys, searchBarForm, selectedRows)
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
              )
            } else if (b.requiredSelected === -1 && selectedRowKeys.length >= 1) {
              return (
                <Popconfirm
                  key={b.key}
                  title={'确定要删除这些记录么?'}
                  placement="left"
                  onConfirm={() => b.cb(selectedRowKeys, searchBarForm, selectedRows)}
                >
                  <Button type={b.type} style={{ marginLeft: 8 }} loading={b.loading}>
                    {b.name}
                  </Button>
                </Popconfirm>
              )
            } else if (b.requiredSelected === 0) {
              return (
                <Button
                  key={b.key}
                  disabled={b.disabled}
                  type={b.type}
                  onClick={() => b.cb(selectedRowKeys, searchBarForm, selectedRows)}
                  style={{ marginLeft: 8 }}
                  loading={b.loading}
                >
                  {b.name}
                </Button>
              )
              // return (<Upload {...b.uploadProps}>
              //   <Button
              //     key={b.key}
              //     type={b.type}
              //     style={{ marginLeft: 8 }}
              //     loading={b.loading}
              //   >{b.name}</Button>
              // </Upload>);
            } else {
              // return (<Button
              //   key={b.key}
              //   type={b.type}
              //   onClick={() => b.cb(selectedRowKeys)}
              //   style={{ marginLeft: 8 }}
              //   loading={b.loading}
              // >{b.name}</Button>);
            }
            return null
          })}
          {selectedRowKeys.length > 0 && (
            <span key="total" style={{ fontSize: 13, marginLeft: 10 }}>
              选择了 {selectedRowKeys.length} 条记录
            </span>
          )}
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          {handleMail && (
            <Button
              icon={'mail'}
              style={{ marginRight: 5 }}
              onClick={handleMail.bind(this, selectedRowKeys, selectedRows)}
            />
          )}
          {handlePrint && (
            <Button
              icon={'printer'}
              style={{ marginRight: 5 }}
              onClick={handlePrint.bind(this, selectedRowKeys, selectedRows)}
            />
          )}
          {
            customBtn && (
              customBtn
            )
          }
          {showColumn !== false && (
            <Dropdown
              overlay={menu}
              onVisibleChange={this.handleVisibleChange}
              visible={colsSwitchVisible}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button icon={'table'} />
            </Dropdown>
          )}
        </Col>
      </Row>
    )
  }

  handleOnRow = (record, index) => {
    return {
      onClick: () => {
        // 点击行
        // console.log(record);
      },
      onMouseEnter: () => {
        // 鼠标移入行
      },
      onDoubleClick: () => {
        this.props.enableDoubleClick !== false && this.handleRowDoubleClick(record, index)
      },
    }
  }

  constructor(props) {
    super(props)

    const { sortBy, sortDirection, columns, rowKey } = props

    this.state = {
      searchBarForm: {},
      fetchData: {
        offset: 0,
        limit: 10,
        sortBy: sortBy || rowKey,
        sortDirection: sortDirection || 'ASC',
      },
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: total => `共 ${total} 条`,
        defaultPageSize: 10,
        defaultCurrent: 0,
        // current: 0,
        total: this.props.total,
      },
      columns,
      colsSwitchVisible: false,
    }
  }

  render() {
    const {
      rowSelection,
      dataSource,
      loading,
      domain,
      scroll,
      filter,
      rowKey,
      enableSelection,
      enablePagination,
      showReset,
      size,
      ...tableProps
    } = this.props
    const { pagination, selectedRowKeys, columns } = this.state
    const visibleColumns = columns.filter(c => c.visible !== false)
    // console.log(visibleColumns);
    pagination.total = this.props.total
    const elRowSelection = {
      // type: 'radio',
      selectedRowKeys, // 不要覆盖
      onChange: (selectedRowKeys, selectedRows) => {
        // 不要覆盖
        this.setState({
          selectedRowKeys,
          selectedRows,
        })
      },
    }
    return (
      <div>
        {filter && (
          <SearchBar
            showReset={showReset}
            domain={domain}
            onFetchForm={this.fetchSearchBarForm}
            onFilterChange={this.onFilterChange}
            filter={filter}
          />
        )}
        <Table
          title={this.renderHeader}
          className={styles.table}
          bordered={true}
          rowKey={rowKey || 'id'}
          size={size || 'middle'}
          onChange={this.handleTableChange}
          loading={loading.effects[`${this.props.domain}/query`]}
          dataSource={dataSource}
          pagination={enablePagination === false ? false : pagination}
          rowSelection={enableSelection === false ? null : { ...elRowSelection, ...rowSelection }}
          onRow={this.handleOnRow}
          rowClassName={getRowClassName}
          // onRowDoubleClick={enableDoubleClick === false ? () => {} : this.handleRowDoubleClick}
          scroll={scroll}
          {...tableProps}
          columns={visibleColumns}
        />
      </div>
    )
  }
}

export default DataTable
