'use strict'

const leap = require('leapjs')

// Leap Motion Driver
const controller = leap.loop(function(frame) {
  if(frame.hands.length > 0) {
    const hand     = frame.hands[0]
    const fingers  = hand.fingers
    const position = hand.palmPosition

    // Adapt the dimensions of the leap motion so it's more suitable to a range 0-127
    let handx = Math.round((((position[0] + 150) / 300) * 127), 0)
    let handy = Math.round((((position[1] -  45) / 400) * 127), 0)
    let handz = Math.round((((position[2] + 150) / 300) * 127), 0)

    // Keep it within 0 - 127
    if (handx > 127) handx = 127
    if (handy > 127) handy = 127
    if (handz > 127) handz = 127
    if (handx <   0) handx = 0
    if (handy <   0) handy = 0
    if (handz <   0) handz = 0

    if (hand.timeVisible !== 0) {
      console.log(...fingers.map((finger) => finger.tipPosition))
      console.log(handx, handy, handz)
    }
  }
})
