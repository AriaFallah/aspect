const SERVER  = 'https://api.kairos.com/media/'
const APP_ID  = 'c7a9d520'
const APP_KEY = 'a795ec792f80a82aeefc3290e2829372'

function dank_face(vid) {
  xhttp.open('POST', SERVER, false)
  xhttp.setRequestHeader("app_id", APP_ID)
  xhttp.setRequestHeader("app_key", APP_KEY)
  xhttp.send("souce=" + vid)
  console.log(xhttp.responseText)
}
