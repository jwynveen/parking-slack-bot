
'use strict'

const _ = require('lodash')
const config = require('../config')
const trending = require('github-trending')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Parkbot',
  icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res, app) => {
  let spots = app.get('available');
  if (!spots) {
    app.set('available', ['6', '9', '10']);
    spots = ['6', '9', '10'];
  }

  const commandValue = payload.text.replace('reserve', '').trim();
  const idx = spots.indexOf(commandValue);

  let attachments = [];
  if (idx > -1) {
    spots.splice(idx, 1);
    app.set('available', spots);
    attachments.push({
      title: `Spot #${commandValue} is now reserved`,
      mrkdwn_in: ['text', 'pretext']
    });
  } else {
    attachments.push({
      title: `Spot #${commandValue} could not be found. Did you type it correctly?`,
      mrkdwn_in: ['text', 'pretext']
    });
  }

  let msg = _.defaults({
    channel: payload.channel_name,
    attachments: attachments
  }, msgDefaults)

  res.set('content-type', 'application/json')
  res.status(200).json(msg)
  return
}

module.exports = { pattern: /reserve/ig, handler: handler }
