
## Background

This integration with Slack is an NFL Crime Service. Using the API found [here](http://nflarrest.com/api/), I take 3 different slash commands from Slack and query different endpoints of the API. These endpoints return data in JSON format, which I then return to Slack via my node.js server. 
You might be thinking- what in the world is an NFL crime service? Well, apparently it's an API that returns information on crime and arrest data from NFL players. I don't know why you'd ever need this information in Slack, but it's an interesting experiment.

Here are the possible commands:

- **/teamcrime** - Given a team's city, lowercase and abbreviated (like 'sea'), this will return the types of crimes and arrest counts for current members of that team in JSON format.
- **/topplayerscrime** - Given a start date and optionally an end date (in format 'YYYY-MM-DD'), this command returns the current NFL players with the most crimes (and information about those crimes) during the period specified. It also returns the information in JSON format.
- **/positioncrime** - Given a position, lowercase and abbreviated (like 'qb' for quarterback), this will return the arrest records of current NFL players of that position in JSON format.

Description of files:

- **app.js** - entry point for app, acts as server and handles requests.
- **nflCrimeAPI.js** - handles outgoing requests to NFL Crime API and returned JSON.
- **verifySig.js** - handles verification that incoming server requests are from Slack, uses secret key listed in Slack app.
- **config.js** - config file servicing important environment variables.

## Instructions for Running and Testing

1. Install Node.js
	- I chose to use Node.js for this project, so you will need it on your machine to run.
2. Grab the code
    - Clone this repo and run **npm install** from your terminal window
    - The entry point for this program is app.js, so run **node app.js** from the directory where the code is.
    - The terminal screen should return a message saying *Server running on port 3000*
3. ngrok
    - I used a service called ngrok that exposes localhost to the public internet, so that Slack urls didn't have to say 'http://localhost..'.
    - Documentation can be found [here](https://ngrok.com/product).
	- Instead, the Slack slash command urls will have the format 'http://541ab21b.ngrok.io/commands'. However, since these expire and you are running from a different localhost, you will have to do the following:
		- Download ngrok and run it on your terminal
		- From that directory, run **ngrok http 3000**
		- ngrok should return saying that the session status is *online*. You then need to copy the url listed next to *forwarding*. This will be used in place of localhost.
		- Log into your Slack workspace (if you don't have one, go create onee)
    - Create an NFL Crime Service App, adding the above slash commands to the app with the URL you created above.
		- For each slash command, change the url to *stuff you copied + /commands*. They should look similar to the above but with a different mix of letters/numbers before *.ngrok.io*.
		- Save these and then reinstall the app to the Slack workspace.
    - Copy your Slack Secret Signing Key and add this to the config.js file
4. Test in Slack
	- With the code running on your local server and ngrok exposing your server to a public address, the slash commands should now execute properly.
	- Try each slash command without any arguments to see the ephemeral help messages returned to Slack.
	- Next, try the following to see the publicly returned JSON:
		- /teamcrime sea
		- /topplayerscrime 2017-01-01
		- /positioncrime qb
	- Then, try inputting invalid parameters like the below to see the ephemeral messages returned:
		- /teamcrime zzz
		- /topplayerscrime 01-01-2017
		- /positioncrime H3LL0
	- Try any other tests you like!

## Further Work

If I had more time, I would do the following in this order:

- Make output in Slack more readable by parsing the JSON. There are nice Node libraries to help with this.
- Add more Regex checks for user input. Maybe even store list of possible entries for team and position to check against, since those are relatively small (~30 and ~15 respectively).
- Write unit tests to verify the server works as expected for both valid and invalid inputs of each slash command.
- Deploy server code with hosting provider so don't have to keep running from localhost and rerouting using ngrok.

### Last Note

You have no idea how bad I wanted to create something where I could incorporate the word 'hacky-slack'. Alas, this idea didn't pan out.

