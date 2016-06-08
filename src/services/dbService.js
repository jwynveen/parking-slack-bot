'use strict';

const _ = require('lodash');
const pg = require('pg');

module.exports = {
  getSpots(next) {
    pg.defaults.ssl = true;
    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (err) throw err;

      const date = new Date();
      const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      //console.log(`Date:${dateString}`);
      client.query(`SELECT date, available FROM parkbot_spots where date='${dateString}';`, (err, result) => {
        //console.log(JSON.stringify(result.rows));

        let spots;
        if (result && result.rows.length) {
          spots = result.rows[0].available;
        }

        if (!spots) {
          spots = ['6', '9', '10'];
        }
        return next(spots);
      });
    });
  },
}