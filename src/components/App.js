import React, { Component } from 'react'
import classNames from 'classnames'
import Image from './Image'
import { recommendTopics, updateUserPrefs } from '../recommend'
import { searchImgur, getEmotion, analyzeImage } from '../api'

navigator.getUserMedia = (
  navigator.getUserMedia
  || navigator.webkitGetUserMedia
  || navigator.mozGetUserMedia
  || navigator.msGetUserMedia
)

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      img: 'http://i.imgur.com/SEQ8MWB.png'
    }
    this.getImage = this.getImage.bind(this)
    this.lock = new Auth0Lock('0cUJF1X5QmrXTsVKdL9CqorbW4SnjbZd', 'aria.auth0.com')
  }

  componentDidMount() {
    this.width   = 320
    this.video   = document.getElementById('v')
    this.canvas  = document.getElementById('c')

    // Create the webcam feed
    navigator.getUserMedia(
      { video: true },
      (stream) => (this.video.src = window.URL.createObjectURL(stream)),
      () => console.log('error')
    )

    this.video.addEventListener('canplay', () => {
      // Tweak to get the proper image captured
      this.height = this.video.videoHeight / (this.video.videoWidth / this.width)
      this.video.setAttribute('width', this.width)
      this.video.setAttribute('height', this.height)
      this.canvas.setAttribute('width', this.width)
      this.canvas.setAttribute('height', this.height)
      this.getImage()
    })
  }

  getImage() {
    const topics = recommendTopics(1)
    searchImgur(topics[0])
      .then(({ data: { data: { items } } }) => {
        let img

        do {
          img = items[Math.floor(Math.random() * items.length)]
        } while (img.is_album || img.link.includes('gif'))

        this.setState({ img: img.link })

        // Grab reaction after 1s delay
        setTimeout(() => {
          this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.width, this.height)
          const image = this.canvas.toDataURL('image/octet-stream')
          Promise.all([getEmotion(image), analyzeImage(img.link)])
            .then(([emotion, imageAnalysis]) => {
              const tags   = imageAnalysis.data.results[0].result.tag.classes.slice(0, 5)
              const scores = emotion.data[0].scores
              console.log(scores)
              console.log(updateUserPrefs([...topics, ...tags], scores))
            })
        }, 2000)
      })
  }

  render() {
    return (
      <main className="ui container">
        <div className="ui divider"></div>
        <text className="ui horizontal divider">React</text>
        <tracking className={style.hidden}>
          <video  id="v" autoPlay="true" />
          <canvas id="c" />
        </tracking>
        <stuff className={classNames(style.flex, style.fadeIn)}>
          <button onClick={this.getImage} className="ui button basic">NEXT</button>
          <div className="ui divider"></div>
          <div>
            <Image img={this.state.img} />
          </div>
        </stuff>
        <div className="ui divider"></div>
        <p>Have the image-browsing experience of a lifetime through the power of facial recognition and machine learning. React watches you while you view images, and learns via sentiment analysis which types of images you like to see and feeds you more like these.</p>
        <button onClick={() => this.lock.show()} className="ui basic blue button">Login</button>
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
