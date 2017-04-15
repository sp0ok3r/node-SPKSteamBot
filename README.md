# SPKSteamBot

In my version i'm using:

- Steam User: https://github.com/DoctorMcKay/node-steam-user
- Steam Totp: https://github.com/DoctorMcKay/node-steam-totp 
- Steam Rep: https://github.com/scholtzm/node-steamrep , when any friends adds you this will check if its a scam or legit.

## Features list: 
- Auto AFK Message
- Auto Accept Pending Friends
- Auto Group Accepter
- Play a non-steam game and idle all other games
- Change states
- Play game with cmd: !play 10
- Play custom game name with: '!cplay Hi i'm using SPKBOT'
- Etc..

| Command | Info |
| ------ | ------ |
| !play | Use '!play 10,730,753' to play multiple or '!play 10' games |
| !cplay | Use '!cplay Hello my dudes' to play custom game names|
| !non | Use '!non Hello my dudes' to play a custom game and all or config games  |
| !all | Use '!all' to play all games |
| !stop | Turn off idling games |
| !shg | Show Steam Hidden Games IDS |  
| !state <x>| 1 - Online /2 - Big Pic 🎮/ 3 - VR 😎 /4 - PHONE 📱/5- WEB 🌐 |  
| !setname | Change bot name |
| !notif <x>| Use !notif on to turn on|
| !wallet | Show the bot wallet money|
| !automsg <x>| Use !automsg on to turn on auto afk messages |
| !autope <x>| Auto Acceetps pending friends |
| !group <x>| on/off |
| !key | Use !key xxx-xxx-xxx  |
| !func | Shows funcs on or off  |

     
### Installation:

```sh
 npm install steam
 npm install steam-user
 npm install steamrep 
 npm install steam-totp
```
After installed, you can start the bot with: node steambot.js

## Editing config files: 
#### Usage of 'config.js' :
- Admin : "76561198041931474", SteamID64 of the account which will control the bot!

- StartOnlineOROffline : '1' you can start the bot in online (1) mode or offline (0), only the game2idle will work!,
 
- WhenLogonStartIdlingAllGames : '0', when the account goes on , it starts idling all games in config 'game2idle',
 
- LogonIdlingNonSteam : '0', If you want to idle all your games and put a non steam game first you can change 0 to 'Anything', and change 'WhenLogonStartIdlingAllGames' to 0, 
 
- 'AllFunctions' : "1", 0 to all functions stay off, or 1 to turn on all functions,

#### Usage of 'savedbots.js' :

- BOTS : "76561198041931474,76561198177157710", this will prevent bots spamming each other if you got multiple bots


### Development

Want to contribute? Great!

External contact: http://steamcommunity.com/id/OfficialSp0ok3r1337/
