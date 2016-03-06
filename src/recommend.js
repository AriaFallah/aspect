/*
* Handles functionality of learning user preferences for memes. This is currently on a per visit
* basis. May eventually add in user preferences. This functionality is based upon keeping track of
* the user's expected enjoyment of topics which are used to classify memes. This set of expected
* enjoyments is then normalized to provide a probability distribution with which to pick the next
* keywords for future memes shown to the user.
*
* Author: Robert Adkins
*/

// expectedEnjoyment['topic'] yields expected enjoyment of 'topic'
const expectedEnjoyment = {
  cat   : 0,
  doge  : 0,
  meme  : 0,
  party : 0,
  milk  : 0,
  trump : 0
}

// numMemes['topic'] says how many memes have been served with label 'topic'
const numMemes = {
  cat   : 0,
  doge  : 0,
  meme  : 0,
  party : 0,
  milk  : 0,
  trump : 0
}

// initial topics all have same probability
Object.keys(expectedEnjoyment).forEach((el) => {
  expectedEnjoyment[el] = 5
})

// should always be nonnegative
function calcE(emotions) {
  return 2 * (emotions.surprise + emotions.happiness) -
    (emotions.anger + emotions.neutral + emotions.disgust + emotions.fear + emotions.sadness) + 1
}

export function recommendTopics(numRecs) {
  let sumEnjoyment = 0
  Object.keys(expectedEnjoyment).forEach((topic) => {
    sumEnjoyment += expectedEnjoyment[topic]
  })

  const topicProbs = []
  let rollingExpected = 0

  Object.keys(expectedEnjoyment).forEach((topic) => {
    rollingExpected += expectedEnjoyment[topic] / sumEnjoyment
    topicProbs.push([topic, rollingExpected])
  })

  const recs = []
  for (let i = 0; i < numRecs; i++) {
    const igloo = Math.random()
    if (igloo <= topicProbs[0][1]) {
      recs.push(topicProbs[0][0])
    } else {
      for (let j = 0; j < topicProbs.length - 1; j++) {
        if (igloo > topicProbs[j][1] && igloo <= topicProbs[j + 1][1]) {
          recs.push(topicProbs[j][0])
        }
      }
    }
  }
  return recs
}

export function updateUserPrefs(topics, emotions) {
  // topics: top 5 topics from latest video (array)
  // emotions: normalized emotional ratings for user reaction (object)
  const enjoyment = calcE(emotions)

  topics.forEach((topic) => {
    if (!expectedEnjoyment[topic]) {
      expectedEnjoyment[topic] = 0
      numMemes[topic] = 0
    }

    expectedEnjoyment[topic] =
    (numMemes[topic] * expectedEnjoyment[topic] + enjoyment) /
    (numMemes[topic] + 1.0)

    numMemes[topic]++
  })

  return expectedEnjoyment
}
