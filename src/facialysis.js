import React from 'react'
import ReactDOM from 'react-dom'
import { createFetch, base, accept, parseJSON } from 'http-client'

const SERVER  = 'https://api.kairos.com/'
const APP_ID  = 'c7a9d520'
const APP_KEY = 'a795ec792f80a82aeefc3290e2829372'

const fetch = createFetch(
  base(SERVER),
  header('app_id' , APP_ID)
  header('app_key', APP_KEY)
  accept('application/json'),
  parseJSON()
)

fetch('/media').then((response) => {
  console.log(response.jsonData)
})

function dank_face(vid) {
  xhttp.open('POST', SERVER, false)
  xhttp.setRequestHeader("app_id", APP_ID)
  xhttp.setRequestHeader("app_key", APP_KEY)
  xhttp.send("souce=" + vid)
  console.log(xhttp.responseText)
}
