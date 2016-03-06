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
  'cat'     : 0,
  'doge'    : 0,
  'house'   : 0,
  'party'   : 0,
  'milk'    : 0,
  'burgers' : 0
}
// num_memes['topic'] says how many memes have been served with label 'topic'
let num_memes = {
  'cat'     : 0,
  'doge'    : 0,
  'house'   : 0,
  'party'   : 0,
  'milk'    : 0,
  'burgers' : 0
}

for (el in expected_enjoyment) {
  expected_enjoyment[el] = 1.0 / expected_enjoyment
}

function recommend_next_topic(cur_meme, cur_vid) {
  // vid is raw video data from webcam
  topics = get_clarifai_analysis(cur_meme) // top 5 topics
  emotions = get_kairos_analysis(cur_vid)  // normalized emotions
  enjoyment = this.enjoyment(emotions)

  for (topic in topics) {
    if (!expected_enjoyment.hasOwnProperty(topic)) {
      expected_enjoyment[topic] = 0
      num_memes[topic] = 0
    }
    expected_enjoyment[topic] =
      (num_memes[topic] * expected_enjoyment[topic] + enjoyment) / (num_memes + 1.0)
    num_memes[topic]++
  }

  sum_enjoyment = 0.0
  for (topic in expected_enjoyment) {
    sum_enjoyment += expected_enjoyment[topic]
  }

  topic_probs = []
  rolling_expected = 0
  for (topic in expected_enjoyment) {
    rolling_expected += expected_enjoyment / sum_enjoyment
    topic_probs.push([topic, rolling_expected])
  }
  
  recs = []
  num_recs = 3
  for (i = 0; i < num_recs; i++) {
    igloo = Math.random()
    if (igloo <= topic_probs[j][1]) {
      recs.push(topic_probs[j][0])
    } else {
      for (j = 0; j < topic_probs.length - 1; j++) {
	if (igloo > topic_probs[j][1] && igloo <= topic_probs[j+1][1]) {
	  recs.push(topic_probs[j][0])
	}
      }
    }
  }

  return recs
}

function enjoyment(emotions) {
  return emotions.surprise * (emotions.smile - emotions.negative) +
    (emotions.attention - 0.5)
}
