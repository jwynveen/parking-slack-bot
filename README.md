# Parkbot

Parkbot is a Slack bot for managing shared parking spaces. Code branched off of [Starbot](https://github.com/mattcreager/starbot)


### Supported `/slash` commands

Create a `/park` [custom slash command](https://api.slack.com/slash-commands), using the URL: `{app-name}.herokuapp.com/commands/parkbot`. *Take note of the provided `token`, this is used to verify requests come from Slack.*

- `/park` or `/park help` - List available commands
- `/park available` - Display available parking spots
- `/park open 10` - Add '10' as an available spot
- `/park reserve 10` - Reserve spot '10', removing it from the available spots

TODO: Manage spots by date

### Configure

```shell
SLACK_TEAM_TOKEN=xoxb...8WRqKWx
NODE_ENV=development
PORT=3000
```
### Run

```shell
$ npm start

Parkbot LIVES on PORT 3000 🚀
```

Visit [localhost:3000](http://localhost:3000).