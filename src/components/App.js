import React, { Component } from 'react'
import classNames from 'classnames'
import Image from './Image'
import { recommendTopics, updateUserPrefs } from '../recommend'
import { searchImgur, getEmotion } from '../api'

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
          getEmotion(image).then(({ data }) => {
            console.log(data[0].scores)
            console.log(updateUserPrefs(topics, data[0].scores))
          })
        }, 2000)
      })
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
          <button onClick={this.getImage} className="ui button basic">NEXT</button>
          <div className="ui divider"></div>
          <div>
            <Image img={this.state.img} />
          </div>
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
