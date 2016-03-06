/*
 * Handles functionality of learning user preferences for memes. This is currently on a per visit
 * basis. May eventually add in user preferences. This functionality is based upon keeping track of
 * the user's expected enjoyment of topics which are used to classify memes. This set of expected
 * enjoyments is then normalized to provide a probability distribution with which to pick the next
 * keywords for future memes shown to the user.
 *
 * Author: Robert Adkins
 */

// expected_enjoyment['topic'] yields expected enjoyment of 'topic'
let expected_enjoyment = {
  cat     : 0,
  doge    : 0,
  house   : 0,
  party   : 0,
  milk    : 0,
  burgers : 0
}
// num_memes['topic'] says how many memes have been served with label 'topic'
let num_memes = {
  cat     : 0,
  doge    : 0,
  house   : 0,
  party   : 0,
  milk    : 0,
  burgers : 0
}
let num_topics = Object.keys(num_memes).length

// initial topics all have same probability
for (let el in expected_enjoyment) {
  expected_enjoyment[el] = 1.0 / num_topics
}

// should always be nonnegative
function calcE(emotions) {
  return ( 
    emotions.surprise  + emotions.happiness -
    (emotions.anger + emotions.disgust +
     emotions.fear + emotions.sadness) + 4
  )
}

function recommend_next_topic(topics, emotions) {
  // topics: top 5 topics from latest video (array)
  // emotions: normalized emotional ratings for user reaction (object)
  let enjoyment = calcE(emotions)

  topics.forEach(function(topic) {
    if(!expected_enjoyment[topic]) {
      expected_enjoyment[topic] = 0
      num_memes[topic] = 0
    }
    
    expected_enjoyment[topic] =
      (num_memes[topic] * expected_enjoyment[topic] + enjoyment) / 
      (num_memes[topic] + 1.0)
      
    num_memes[topic]++
  })

  let sum_enjoyment = 0
  Object.keys(expected_enjoyment).forEach(function(topic) {
    console.log(sum_enjoyment)
    sum_enjoyment += expected_enjoyment[topic]
  })
  
  let topic_probs = []
  let rolling_expected = 0
  
  Object.keys(expected_enjoyment).forEach(function(topic) {
    rolling_expected += expected_enjoyment[topic] / sum_enjoyment
    topic_probs.push([topic, rolling_expected])
  })

  let recs = []
  let num_recs = 3
  for (let i = 0; i < num_recs; i++) {
    let igloo = Math.random()
    if (igloo <= topic_probs[0][1]) {
      recs.push(topic_probs[0][0])
    } else {
      for (let j = 0; j < topic_probs.length - 1; j++) {
	    if (igloo > topic_probs[j][1] && igloo <= topic_probs[j+1][1]) {
          recs.push(topic_probs[j][0])
    	}
      }
    }
  }

  return recs
}
