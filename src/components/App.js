import React, { Component } from 'react'
import classNames from 'classnames'
import Image from './Image'
import { searchImgur, analyzeImage, getEmotion } from '../api'

navigator.getUserMedia = (
  navigator.getUserMedia
  || navigator.webkitGetUserMedia
  || navigator.mozGetUserMedia
  || navigator.msGetUserMedia
)

export default class App extends Component {
  componentDidMount() {
    let height   = 0
    const width  = 320
    const canvas = document.getElementById('c')
    const video  = document.getElementById('v')

    // Create the webcam feed
    navigator.getUserMedia(
      { video: true },
      (stream) => (video.src = window.URL.createObjectURL(stream)),
      () => console.log('error')
    )

    // Grab the reaction of the user
    video.addEventListener('canplay', () =>
      // Delay reaction capture 1s so they have time to see the image
      setTimeout(() => {
        // Tweak to get the proper image captured
        height = video.videoHeight / (video.videoWidth / width)
        video.setAttribute('width', width)
        video.setAttribute('height', height)
        canvas.setAttribute('width', width)
        canvas.setAttribute('height', height)
        canvas.getContext('2d').drawImage(video, 0, 0, width, height)

        const image = canvas.toDataURL('image/octet-stream')
        // getEmotion(image).then((x) => console.log(x))
      }, 2000))
  }

  render() {
    return (
      <main className="ui container">
        <text className="ui horizontal divider">Meme Rider</text>
        <tracking className={style.hidden}>
          <video  id="v" autoPlay="true" />
          <canvas id="c" />
        </tracking>
        <display className={classNames(style.flex, style.fadeIn)}>
          <div>
            <Image />
          </div>
          <div className="ui divider"></div>
          <button className="ui button basic">NEXT</button>
        </display>
      </main>
    )
  }
}

const style = cssInJS({
  hidden: {
    display: 'none'
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  fadeIn: {
    animation: 'fadein 0.8s ease-in-out',
    'animation-fill-mode': 'forwards',
    opacity: 0
  }
})
