import { connect } from 'react-refetch'

export default connect.defaults({
  buildRequest: function (mapping) {
    if (mapping.method === 'get') {
      mapping.params = {
        _t: Date.parse(new Date()) / 1000,
        ...mapping.params,
      }
    }

    const options = {
      method: mapping.method,
      headers: { ...mapping.headers, 'el-xsrf': localStorage.getItem('csrfToken') },
      credentials: 'include',
      redirect: mapping.redirect,
      mode: mapping.mode,
      body: mapping.body,
      params: mapping.params,
    }

    // url: api.app.cartLines,
    //   method: 'get',
    //   data: params,

    // console.log(mapping)
    // console.log(options)
    return new Request(mapping.url, options)
  },
  // handleResponse: function (response) {
  //   console.log(response)
  //   // return response
  // },
})
