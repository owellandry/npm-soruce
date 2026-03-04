'use strict'

module.exports = {
  // making this a runner so it can be mocked
  async FETCH(dispatch, options) {
    const {url, method, body: reqBody = {}, headers, csrftoken = reqBody.csrftoken} = options

    const needsBody = method !== 'GET'

    if (!csrftoken && needsBody) {
      throw new Error('csrftoken must be defined')
    }

    const res = await window.fetch(url, {
      method,
      credentials: 'include',
      headers: Object.assign(
        {
          'x-csrf-token': csrftoken,
          accept: 'application/json',
        },
        headers,
      ),
      body: needsBody
        ? JSON.stringify(
            Object.assign(
              {
                csrftoken,
              },
              reqBody,
            ),
          )
        : undefined,
    })

    const requestId = res.headers.get('request-id') || res.headers.get('CF-Ray')
    console.log(`${requestId ? `Request ID ${requestId}: ` : ''}${method} ${url} responded with ${res.status}`)

    if (res.status > 399) {
      let body = {message: 'something went wrong'}

      try {
        body = await res.json()
      } catch (e) {
        console.error(e)
      }

      throw Object.assign(new Error(body.message), {
        statusCode: res.status,
        body,
      })
    }

    const rawBody = await res.text()
    try {
      return JSON.parse(rawBody)
    } catch (e) {
      return rawBody
    }
  },
}
