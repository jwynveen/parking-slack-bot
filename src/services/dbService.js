'use strict';

const _ = require('lodash');
const moment = require('moment');
const pg = require('pg');
pg.defaults.ssl = true;

module.exports = {
  getSpots(date, next) {
    var client = getClient();
    getAvailable(client, date, (spots) => {
      client.end();
      if (!spots) {
        spots = ['6', '9', '10']; // TODO: set up defaults in parkbot_schedule table
      }
      return next(spots);
    });
  },

  saveSpots(date, spots, next) {
    const client = getClient();
    getAvailable(client, date, (availableSpots) => {
      const query = !!availableSpots
        ? 'UPDATE parkbot_spots SET available=$2 WHERE date=$1'
        : 'INSERT INTO parkbot_spots (date, available) VALUES ($1, $2)';
      console.log(query);
      client.query({
        text: query,
        values: [moment(date).format('MM/DD/YYYY'), spots]
      }, (err) => {
        if (err) throw err;
        client.end();
        return next();
      });
    });
  }
}

function getClient() {
  var client = new pg.Client(process.env.DATABASE_URL);
  //client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
  client.connect();
  return client;
}
function getAvailable(client, date, next) {
  const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  client.query({
    text: 'SELECT date, available FROM parkbot_spots where date=$1;',
    values: [moment(date).format('MM/DD/YYYY')]
  }, (err, result) => {
    if (err) throw err;
    let spots;
    if (result && result.rows.length) {
      spots = result.rows[0].available;
    }
    return next(spots);
});
}