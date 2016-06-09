'use strict';

const _ = require('lodash');
const config = require('../config');
const dbService = require('../services/dbService');

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Parkbot',
  icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res) => {
  dbService.getSpots(new Date(), (spots) => {
    res.set('content-type', 'application/json')

    let msg = _.defaults({
      channel: payload.channel_name
    }, msgDefaults);
    const commandValue = payload.text.replace('open', '').trim();
    const idx = spots.indexOf(commandValue);

    if (idx === -1) {
      spots.push(commandValue);
      spots.sort();

      dbService.saveSpots(new Date(), spots, () => {
        msg.text = `Spot #${commandValue} is now available`;
        msg.attachments = [{
          title: 'Available Spots:',
          text: spots.map((spot) => `• Spot #${spot}`).join('\n'),
          mrkdwn_in: ["text"]
        }];
        return res.status(200).json(msg);
      });
    } else {
      msg.response_type = 'ephemeral';
      msg.text = `Spot #${commandValue} is already available.`;
      msg.attachments = [{
        title: 'Available Spots:',
        text: spots.map((spot) => `• Spot #${spot}`).join('\n'),
        mrkdwn_in: ["text"]
      }];
      return res.status(200).json(msg);
    }
  });
}

module.exports = { pattern: /open/ig, handler: handler }
