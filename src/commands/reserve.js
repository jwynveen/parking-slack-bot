'use strict';

const _ = require('lodash');
const config = require('../config');
const trending = require('github-trending');
const dbService = require('../services/dbService');

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Parkbot',
  icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res, app) => {
  dbService.getSpots(new Date(), (spots) => {
    res.set('content-type', 'application/json')

    let msg = _.defaults({
      channel: payload.channel_name
    }, msgDefaults);
    const commandValue = payload.text.replace('reserve', '').trim();
    const idx = spots.indexOf(commandValue);

    let attachments = [];
    if (idx > -1) {
      spots.splice(idx, 1);

      dbService.saveSpots(new Date(), spots, () => {
        msg.text = `Spot #${commandValue} is now reserved`;
        msg.attachments = [{
          title: 'Available Spots:',
          text: spots.map((spot) => `• Spot #${spot}`).join('\n'),
          mrkdwn_in: ["text"]
        }];
        return res.status(200).json(msg);
      });
    } else {
      msg.response_type = 'ephemeral';
      msg.text = `Spot #${commandValue} is not available. Here's the open spots:`;
      msg.attachments = [{
        title: 'Available Spots:',
        text: spots.map((spot) => `• Spot #${spot}`).join('\n'),
        mrkdwn_in: ["text"]
      }];
      return res.status(200).json(msg);
    }
  });
}

module.exports = { pattern: /reserve/ig, handler: handler }
