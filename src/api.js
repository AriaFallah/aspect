import axios from 'axios'
import config from './config'
import { makeblob } from './util'

export const searchImgur = (tag) =>
  axios({
    url: `https://api.imgur.com/3/gallery/t/${tag}`,
    method: 'get',
    headers: {
      Authorization: `Client-ID ${config.imgurKey}`
    }
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
