import axios from 'axios'
import config from './config'
import { makeblob } from './util'

export const searchImgur = () =>
  axios({
    // Create custom imgur gallery
    // Starts with a random image
    // Take top 5 clarafai tags * positive or negative reaction
    // If the tag * reaction < .5 remove the tag from the gallery
    // something like that
  })

export const analyzeImage = (url) =>
  axios({
    url: 'https://api.clarifai.com/v1/tag',
    method: 'post',
    headers: {
      Authorization: `Bearer ${config.clarifaiKey}`
    },
    params: {
      url
    }
  })

export const getEmotion = (image) =>
  axios({
    url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
    method: 'post',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': config.microsoftKey
    },
    data: makeblob(image)
  })
