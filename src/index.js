import React from 'react'
import ReactDOM from 'react-dom'
import { createFetch, base, accept, parseJSON } from 'http-client'

const fetch = createFetch(
  base('https://api.stripe.com/v1'),
  accept('application/json'),
  parseJSON()
)

fetch('/customers/5').then((response) => {
  console.log(response.jsonData)
})

ReactDOM.render(
  <h1>DANK</h1>,
  document.getElementById('app')
)
