# SPKSteamBot

In my version i'm using:

- Steam User: https://github.com/DoctorMcKay/node-steam-user
- Steam Totp: https://github.com/DoctorMcKay/node-steam-totp
- Steam Rep: https://github.com/scholtzm/node-steamrep

You got a lot of features like: 
Auto AFK Message
Auto Accept Pending Friends
Auto Group Accepter
Play a non-steam game and idle all other games
Change state
Play game with cmd: !play 10
Play custom game name with: !cplay Hi i'm using SPKBOT
All 

### Installation:

```sh
 npm install steam
 npm install steam-user
 npm install steamrep 
 npm install steam-totp
```
After installed, you can start the bot with: node steambot.js


### Usage of 'config.js' :

- StartOnlineOROffline : '1' you can start the bot in online (1) mode or offline (0), only the game2idle will work!,
 
- WhenLogonStartIdlingAllGames : '0', when the account goes on , it starts idling all games in config 'game2idle',
 
- LogonIdlingNonSteam : '0', If you want to idle all your games and put a non steam game first you can change 0 to 'Anything', and change 'WhenLogonStartIdlingAllGames' to 0, 
 
- 'AllFunctions' : "1", 0 to all functions stay off, or 1 to turn on all functions,


### Development

Want to contribute? Great!

External contact: http://steamcommunity.com/id/OfficialSp0ok3r1337/
