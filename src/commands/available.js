
'use strict'

const _ = require('lodash')
const config = require('../config')
const trending = require('github-trending');
const dbService = require('../services/dbService');

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Parkbot',
  icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res, app) => {
  dbService.getSpots((spots) => {

    var attachments = spots.map((spot) => {
      return {
        title: `Spot #${spot}`,
        //title_link: spot.url,
        //text: `_${spot.description}_\n${spot.language} • ${spot.star}>`,
        mrkdwn_in: ['text', 'pretext']
      }
    });

    let msg = _.defaults({
      channel: payload.channel_name,
      attachments: attachments
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
  });
}

module.exports = { pattern: /available/ig, handler: handler }
