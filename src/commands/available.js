
'use strict'

const _ = require('lodash')
const config = require('../config')
const dbService = require('../services/dbService');

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Parkbot',
  icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res, app) => {
  dbService.getSpots(new Date(), (spots) => {

    let msg = _.defaults({
      channel: payload.channel_name,
    }, msgDefaults);

    msg.attachments = [{
      title: 'Available Spots:',
      text: spots.map((spot) => `• Spot #${spot}`).join('\n'),
      mrkdwn_in: ["text"]
    }];

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
  });
}

module.exports = { pattern: /available/ig, handler: handler }
