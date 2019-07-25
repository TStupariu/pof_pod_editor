const formatSecondsToTime = (rawSeconds) => {
  let hours = 0
  let minutes = 0
  let seconds = 0
  if (rawSeconds > 60) {
    minutes = Math.floor(rawSeconds / 60)
    seconds = rawSeconds - (minutes * 60)
    if (minutes > 60) {
      hours = Math.floor(minutes / 60)
      minutes = rawSeconds - (hours * 60)
    }
  } else {
    seconds = rawSeconds
  }
  seconds = parseFloat(Math.round(seconds * 100) / 100).toFixed(2)
  return `${hours ? `${hours}:` : ''}${minutes ? `${minutes}:` : ''}${seconds ? seconds : 0}`
}

const convertTimeToFirebaseKey = (time) => {
  return `${time.toFixed(5) * 1000000}`
}

const sanitize = (value) => value.replace(/\.|\//g, "")

export {
  formatSecondsToTime,
  convertTimeToFirebaseKey,
  sanitize
}
