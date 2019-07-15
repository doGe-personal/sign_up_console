import React from 'react'
import { Avatar, Divider, Form, Icon, Input, Skeleton } from 'antd'
import crypto from 'crypto'
import Identicon from 'identicon.js'
import { config, refetchConnect } from '@utils'
import styles from './styles.less'

class Profile extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { editMode: false }
  }

  toggleEditMode() {
    this.setState({
      editMode: !this.state.editMode,
    })
  }

  render() {
    const { userFetch } = this.props
    const { editMode } = this.state

    if (userFetch.pending) {
      return <Skeleton active />
    } else if (userFetch.rejected) {
      // return <ErrorBox error={userFetch.reason}/>
    } else if (userFetch.fulfilled) {
      const hash = crypto.createHash('md5')
      hash.update(userFetch.value.id + '')
      const imgData = new Identicon(hash.digest('hex'), { format: 'svg' }).toString()
      const imgUrl = 'data:image/svg+xml;base64,' + imgData
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.edit} onClick={this.toggleEditMode.bind(this)}>
              <Icon theme="twoTone" type={editMode ? 'save' : 'edit'} />
            </div>
            <div>
              <div className={styles.avatar}>
                <Avatar size={104} src={imgUrl} />
              </div>
              <div className={styles.name}>
                <h2> {!editMode ? userFetch.value.info.name :
                  <Input style={{ width: '30%', textAlign: 'center', fontWeight: 'bold' }}
                    defaultValue={userFetch.value.info.name}
                    size="large" />}</h2>
                <h3>{userFetch.value.roles[0]}</h3>
              </div>

              <div className={styles.info}>
                <p><Icon theme="twoTone" type="phone" />
                  {!editMode ? userFetch.value.user.phone :
                    <Input defaultValue={userFetch.value.user.phone} />}
                </p>
                <p><Icon theme="twoTone" type="mail" />
                  {!editMode ? userFetch.value.user.email :
                    <Input defaultValue={userFetch.value.user.email} />}
                </p>
                <p><Icon theme="twoTone" type="bank" />上海埃林哲软件系统股份有限公司－产品与研发事业部－架构组</p>
              </div>
              <Divider dashed />
              <div>
                组织
              </div>
              <Divider dashed />
              <div>
                角色
              </div>
              <Divider dashed />
              <div>
                权限
              </div>
            </div>
          </div>

        </div>
      )
    }
  }
}

export default refetchConnect(props => ({
  userFetch: config.baseURL + config.api.basic.principal,
}))(Form.create()(Profile))
