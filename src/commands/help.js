
'use strict'

const _ = require('lodash')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Parkbot',
  icon_emoji: config('ICON_EMOJI')
}

let attachments = [
  {
    title: 'Parkbot will help you find the available parking spots',
    color: '#2FA44F',
    text: '`/park available` returns available parking spots',
    mrkdwn_in: ['text']
  },
  {
    title: 'Reserve a Spot:',
    color: '#2FA44F',
    text: '`/park reserve [spot#]` reserves parking spot',
    mrkdwn_in: ['text']
  },
  {
    title: 'Open a Spot:',
    color: '#2FA44F',
    text: '`/park open [spot#]` make parking spot available',
    mrkdwn_in: ['text']
  },
  {
    title: 'Configuring Parkbot',
    text: '`/park help` ... you\'re lookin at it! \n',
    mrkdwn_in: ['text']
  }
]

const handler = (payload, res) => {
  let msg = _.defaults({
    channel: payload.channel_name,
    attachments: attachments
  }, msgDefaults)

  res.set('content-type', 'application/json')
  res.status(200).json(msg)
  return
}

module.exports = { pattern: /help/ig, handler: handler }
