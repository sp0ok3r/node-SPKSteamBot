//  ___________ _____  _____ _   __ ___________
// /  ___| ___ \  _  ||  _  | | / /|____ | ___ \
// \ `--.| |_/ / | | || | | | |/ /     / / |_/ /
//  `--. \  __/| | | || | | |    \     \ \    /
// /\__/ / |   \ |_/ /\ \_/ / |\  \____/ / |\ \
// \____/\_|    \___/  \___/\_| \_/\____/\_| \_|
 
/*
*/


var SPK = "SP0OK3RBOT v2.2b";
var ver = "2.2b"; 
var SPKad = true;


var Steam = require('steam');
var SteamUser = require('steam-user');
var SteamRepAPI = require('steamrep');
var SteamTotp = require('steam-totp'); // Generates Phone Code


var config = require('./config.json');
var AntiSpamBetweenBots = require('./savedbots.json');

var client = new SteamUser();


// appIDS
var AllappIDS = config.Games2Idle.split(',').map(Number);
//appIDS


// Boolean
var AutoAFKMsgBool = true;
var AutoAcceptPendingFriends = true;
var groupAutoAccepter = true;
var notifications = true;
var ReceiveMessagesFromBot = true;
//* Boolean

// Save Strings
var AdminName;
var botID;
var botID2;
var state2use;
var SteamFlag;
var Wallet;
var Green = "\x1b[32m"
var Yellow = "\x1b[33m"
var Red = "\x1b[31m"
var Cyan = "\x1b[36m"
var White = "\x1b[37m"
//* Save Strings

//  ConfigAlias
var AdminID = config.Admin;
var Username = config.username;
var Password = config.password;
var PhoneCode = process.argv[2];
var PhoneCodeSharedKey = config.Phone_secret;
var CustomGameFromConfig = config.LogonIdlingNonSteam;
//* ConfigAlias


function check4SharedKey(secret) {
    if (secret != "0") {
        var code = SteamTotp.generateAuthCode(PhoneCodeSharedKey);
        return code;
    } else if (secret == "0") {
        console.log("Phone Shared Key not defined in config, Starting manually...");
        return PhoneCode;
    }
}
//_________________________________________________________________________________________
// LogON
client.logOn({
                "accountName": Username,
                "password": Password,
                "twoFactorCode": check4SharedKey(config.Phone_secret),
                "machineName": Username + " " + SPK
});

client.on('loggedOn', function (details) {
    botID = client.steamID.getSteamID64();
    client.setPersona(Number(config.StartOnlineOROffline));
    client.getPersonas([botID], function(personas) {
    AdminName = personas[botID]["player_name"];
	console.log(Green + "  Name: "+ Yellow + personas[botID]["player_name"] + Cyan + "  LOGGED IN!");
    console.log(Green +"  Press" +White+ " CTRL" +Green+ " +" +White+ " C" +Green+ " to stop.");
    CountGamesCfg();
    Check4Functions();
    AutoPlay();
});


function CountGamesCfg() {
var GameCount = ((config.Games2Idle.match(/,/g) || []).length + 1);
    if (GameCount <= 32){ // less than 32 or equal
    console.warn(White+'Detected: '+Green + GameCount + White+ " games in config!" + '\n' + SPK);
    client.chatMessage(AdminID, 'Detected: ' + GameCount + " games in config!"+ 
                                    '\n' + SPK);
} else if (GameCount > 32) { // bigger than 32
    console.warn(White+'Detected: '+Red + GameCount + White+ " games in config! [MAX:32]" + '\n' + SPK);
    client.chatMessage(AdminID, 'Max games exceeded: ' + GameCount + " | Max 32. "+ 
                                    '\n' + SPK);
    setTimeout(function(){ process.exit(1) },3500);                           
    }
}

// Function Auto Play
    function AutoPlay() {
    if (config.WhenLogonStartIdlingAllGames == "1") {
        client.gamesPlayed(SPK);
        setTimeout(function(){ client.gamesPlayed(AllappIDS) },3500);
        client.chatMessage(AdminID, 'Starting idling all games on config...' +
                                    '\nTo stop write !stop' +
                                    '\n' + SPK);
    } else if (CustomGameFromConfig != "0") {
        client.gamesPlayed(SPK);
        setTimeout(function(){ NONSTEAMplay(CustomGameFromConfig); },3500);
    } else {
        client.chatMessage(AdminID, 'Error, Auto play or NonSteamGame disabled.' + 
                                    '\n' + SPK);
        }
    }
});

function Check4Functions() {
if (config.AllFunctions == "1") {
    console.log("All Functions turned on.");
    } else if (config.AllFunctions == "0") {
        console.log("All Functions turned off.");
        AutoAFKMsgBool = false;
        AutoAcceptPendingFriends = false;
        groupAutoAccepter = false;
        notifications = false;
        ReceiveMessagesFromBot = false;
    }
}

            
function NONSTEAMplay(gameReturned) {
    client.gamesPlayed([0]);
    if (SPKad == true) {
        var CustomNonSteam = {"game_id": 15444025664222527488,"game_extra_info": gameReturned}
        var AllGamesIDS2 = config.Games2Idle.split(',').map(Number);
        AllGamesIDS2.unshift(CustomNonSteam);
        client.gamesPlayed(AllGamesIDS2);
    } else {
        client.chatMessage(steamID, "Error on NonSteamGame." + "\n" + SPK);
    }
}


//  Flag function
SteamUser.prototype.Flags = function (state) {
    this._send(SteamUser.EMsg.ClientChangeStatus, {
        "persona_state": state,
        "persona_state_flags": SteamFlag
    });
}
function FlagsChanger(state) {
    if (state == 0) {
        SteamFlag = 0;
        client.Flags(0);

    } else if (state == 1) {
        client.setUIMode(0); // online
        SteamFlag = 1;
        client.Flags(1);
        
    } else if (state == 2) {
        client.setUIMode(1); // bigpic

    } else if (state == 3) {
        SteamFlag = 2048; // vr
       client.Flags(1);

    } else if (state == 4) {
        client.setUIMode(2); // tele

    } else if (state == 5) {
        client.setUIMode(3); // web
    }

}
//* Flag function
// ******************Functions

/*                 HELP COMMANDs                        */
client.on("friendMessage", function (steamID, message) {
     if (steamID == AdminID && message == '!help') {
                client.chatMessage(steamID,'⇲' +
                    '\n     📡                          BOT INSTRUCTIONS            ¦̵̱ ̵̱ ̵̱ ̵̱ ̵̱(̢ ̡͇̅└͇̅┘͇̅ (▤8כ−◦' +
                    '\n——————————————————————————————————————' +
                    '\n                                               ✉ Idler settings' +
                    '\n' +//***********************************************************Space
                    '\n     !play <appid>' +
                    "\n         Ex.: !play 10 or !play 10,730,753" +                
                    '\n' +//***********************************************************Space
                    '\n     !cplay <custom>' +
                    '\n         Ex.: !cplay Editing some sick gameplay.' +
                    '\n' +//***********************************************************Space
                    '\n     !non <x>' +
                    '\n         Ex.: Playing: nice batatas'+ 
                    '\n' +//***********************************************************Space
                    '\n     !all' +
                    '\n         ·Play all games in config.' +
                    '\n' +//***********************************************************Space
                    '\n     !stop' +
                    '\n         ·Turn off all games.' +
                    '\n' +//***********************************************************Space
                    '\n     !shg' +
                    "\n         ·List hidden steam games." +
                    '\n' +//***********************************************************Space
                    '\n——————————————————————————————————————' +
                    '\n                                               ✉ State settings' +
                    '\n' +//***********************************************************Space
                    '\n     !state <state>' +
                    '\n         ·Replace state with 1-5' +
                    '\n' +//***********************************************************Space
                    '\n     States:(ex.: !state 4)' +
                    '\n         [1]    - Online' +
                    '\n         [2]    - Big Pic 🎮' +
                    '\n         [3]    - VR 😎' +
                    '\n         [4]    - PHONE 📱' +
                    '\n         [5]    - WEB 🌐' +
                    '\n' +//***********************************************************Space
                    '\n——————————————————————————————————————' +
                    '\n                                       ✉ Miscellaneous commands' +
                    '\n' +//***********************************************************Space
                    "\n      !setname <x>" +
                    "\n         ·This'll change your bot's name!" +
                    '\n' +//***********************************************************Space
                    '\n      !notif <x>' +
                    '\n         ·Replace <x> with on or off' +
                    "\n         ·This'll enable/disable all notifications"+
                    '\n' +//***********************************************************Space
                    '\n      !wallet' +
                    "\n         ·Check bot's wallet. [̲̅$̲̅(̲̅0)̲̅$̲̅]" +
                    '\n' +//***********************************************************Space
                    '\n      !automsg <x>'+
                    '\n         ·Replace <x> with on or off' +
                    "\n         ·This'll enable/disable auto afk messages"+
                    '\n' +//***********************************************************Space
                    '\n      !autope <x>'+
                    '\n         ·Replace <x> with on or off' +
                    "\n         ·This'll enable/disable auto friends accepter"+
                    '\n' +//***********************************************************Space
                    '\n      !group <x>'+
                    '\n         ·Replace <x> with on or off' +
                    '\n' +//***********************************************************Space
                    '\n      !key xxxx-xxxx-xxxx'+
                    "\n         ·Redeems a game code (CD key) on your account"+
                    '\n' +//***********************************************************Space
                    '\n      !func'+
                    "\n         ·Check if any function is on or off"+
                    '\n' +//***********************************************************Space
                    '\n      !changelog' +
                    "\n         ·Usᴀɢᴇ: ᴄʜᴇᴄᴋ ʙᴏᴛ's ᴜᴘᴅᴀᴛᴇs." +
                    '\n' +//***********************************************************Space
                    '\n——————————————————————————————————————' +
                    "\n                                                                                          " + SPK + 
                    "\n" + '⇱');
                    } else if (steamID == AdminID && message == '!shg') {
                    client.chatMessage(steamID,'⇲' +
                    '\n Steam Hidden Games:' +
                    '\n'+
                    '\n [753]- Steam (Client)' +
                    '\n [754]- Steam Economy' +
                    '\n [760]- Steam Screenshots' +
                    '\n [761]- Steam Cloud - Videos' +
                    '\n [764]- Steam Cloud' +
                    '\n [765]- Greenlight' +
                    "\n [766]- Steam Workshop (won't register playtime)" +
                    '\n [767]- Steam Artwork' +
                    '\n [202351]- Beta Access to the New Steam Community' +
                    '\n [202352]- Steam Trading Card Beta Access' +
                    '\n [218800]- Steam Software Beta Access' +
                    '\n [221410]- Steam for Linux'+
                    '\n [241100]- Steam Controller Configs' +
                    '\n [248210]- Game Library Sharing Access' +
                    '\n [250820]- SteamVR' +
                    '\n'+
                    "\n" + SPK);

            } else if (steamID == AdminID && message == '!changelog') {
                client.chatMessage(AdminID,
                    '\nChangelog for version ' + ver + ':'+
                    '\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯' +
                    '\n added function to check if the client got 32 games in config' +
                    '\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯' +
                    "\n" + SPK);
                } else {    
                if (config.AutoAFKMsgActivate == "1" && AutoAFKMsgBool == true) {
                    if (AntiSpamBetweenBots.BOTS.includes(steamID)) {
                    // se a steamID é outro bot, então não mandar nada; (anti spam 2020)
                    } else {
                        client.chatMessage(steamID, config.AutoAFKMsg + "\n" + SPK); // Auto reply
                            if (ReceiveMessagesFromBot == true) {
                            client.getPersonas([steamID], function(personas) {
                            client.chatMessage(AdminID, "\nMessage from: "+ personas[steamID]["player_name"] + 
                                                        "\nWith: " + message + 
                                                        "\nTo turn off this write !getmsg off" +
                                                        "\n" + SPK);
                            });
                        }
                    }
                }
            } 
});
/*                 HELP COMMAND                        */
client.on("friendMessage", function (steamID, message) {
        if (steamID == AdminID && message.indexOf('!notif') == 0) { 
                   var onFunct = message.replace('!notif ', ''); 
                    if (onFunct == 'on') {
                        notifications = true;
                        client.chatMessage(steamID, "Auto Trade/Items/Comments Checkers Turned: ON" + "\n" + SPK);
                    } else if (onFunct == 'off') {
                        notifications = false;
                        client.chatMessage(steamID, "Auto Trade/Items/Comments Checkers Turned: OFF" + "\n" + SPK);
                    }
                    } else if (steamID == AdminID && message.indexOf('!autope') == 0) {
                    var pending = message.replace('!autope ', ''); // apaga 
                    if (pending == 'on') {
                        AutoAcceptPendingFriends = true;
                        client.chatMessage(steamID, "AutoPendingFriendsAccepter Turned: ON" + "\n" + SPK);
                    } else if (pending == 'off') {
                        AutoAcceptPendingFriends = false;
                        client.chatMessage(steamID, "AutoPendingFriendsAccepter Turned: OFF" + "\n" + SPK);
                    }
                }  
});
client.on("friendMessage", function (steamID, message) {
        if (steamID == AdminID && message.indexOf('!group') == 0) {
                    var group = message.replace('!group ', ''); // apaga
                        if (group == 'on') {
                        groupAutoAccepter = true;
                        client.chatMessage(steamID, "AutoGroupAccepter Turned: ON" + "\n" + SPK);
                    } else if (group == 'off') {
                        groupAutoAccepter = false;
                        client.chatMessage(steamID, "AutoGroupAccepter Turned: OFF" + "\n" + SPK);
                        }
            } 
});

client.on("friendMessage", function (steamID, message) {
        if (steamID == AdminID && message.indexOf('!state') == 0) {
                state2use = message.replace('!state ', '');
                if (state2use > 5) {
                    client.chatMessage(AdminID, 'State Error, max: 5!' + "\n" + SPK);
                } else if (state2use > 0)
                    client.chatMessage(AdminID, 'State Changed: '+ state2use + "\n" + SPK);
                    FlagsChanger(state2use);               // Restart func
            
            } else if (steamID == AdminID && message == '!all') {
                client.gamesPlayed(SPK);
                setTimeout(function(){ client.gamesPlayed(AllappIDS) },2000);
                client.chatMessage(steamID, "Playing all games on config: " + AllappIDS + "\n" + SPK);

            } else if (steamID == AdminID && message == '!wallet') {
                client.chatMessage(steamID, Wallet);  

           } else if (steamID == AdminID && message == '!stop') {
                client.gamesPlayed(SPK);
                setTimeout(function(){ client.gamesPlayed([0]) },1500);
                client.chatMessage(steamID, "Turning all games off" + "\n" + SPK);

            } else if (steamID == AdminID && message == '!func') {  
                    client.chatMessage(AdminID, 
                      //  "\n Auto Functions ON/OFF:" + // ADD 
                            "\n Notifications: " + notifications +
                            "\n AFKMsg: " + AutoAFKMsgBool +
                            "\n PendingFriends Accept: " + AutoAcceptPendingFriends +
                            "\n Group Accepter: " + groupAutoAccepter +
                            "\n ReceiveMessagesFromBot: " + ReceiveMessagesFromBot +
                            "\n NonSteamGame: " + SPKad +
                            "\n" + SPK);
        }
});

//_________________________________________________________________________________________
// Message
client.on("friendMessage", function (steamID, message) {
            if (steamID == AdminID && message.indexOf('!play') == 0) {
                var appID = message.replace('!play ', ''); // apaga !play
                var MultiIDS = appID.split(',').map(Number);
                client.gamesPlayed(SPK);
                setTimeout(function(){ client.gamesPlayed(MultiIDS) },2555);
                client.chatMessage(steamID, "Now idling AppID(s): " + appID +
                                      "\n Write !stop if you want to stop idling!" + "\n" + SPK);
                    
            } else if (steamID == AdminID && message.indexOf('!cplay') == 0) {
                     var customApp = message.replace('!cplay ', ''); // apaga !cplay
                     var maxlengthCplay = customApp.length;
                     if (maxlengthCplay > 63) { // maior que 63
                        client.chatMessage(steamID, "Max Custom Name Game exceeded: 63 chars!" + "\n" + SPK);

                     } else if (maxlengthCplay <= 63) { // menor ou igual que 63
                         client.gamesPlayed(SPK);
                         setTimeout(function(){ client.gamesPlayed(customApp) },2555);
                         client.chatMessage(steamID, "Now idling CustomGame: " + customApp +
                                      "\n Write !stop if you want to stop idling!" + "\n" + SPK);
        }
    }
});


client.on("friendMessage", function (steamID, message) {
    if (steamID == AdminID && message.indexOf('!setname') == 0) {
                var NewName = message.replace('!setname ', ''); // apaga 
                var maxlengthName = NewName.length;
                     if (maxlengthName > 32) { // maior que 63
                        client.chatMessage(steamID, "Max Steam Name exceeded: 33 chars!" + "\n" + SPK);
                     } else if (maxlengthName <= 32) { // menor ou igual que 63
                        client.setPersona(1, NewName);
                        client.chatMessage(steamID, "Name changed to: " + NewName + "\n" + SPK);
                    }
    }
});


client.on("friendMessage", function (steamID, message) {
     if (steamID == AdminID && message.indexOf('!automsg') == 0) {
                var msg = message.replace('!automsg ', ''); // apaga 
                    if (msg == 'on') {
                        AutoAFKMsgBool = true;
                        client.chatMessage(steamID, "AutoAFKMsg Turned: ON" + "\n" + SPK);
                    } else if (msg == 'off') {
                        AutoAFKMsgBool = false;
                        client.chatMessage(steamID, "AutoAFKMsg Turned: OFF" + "\n" + SPK);
                        }
        }
});

client.on("friendMessage", function (steamID, message) {
    if (steamID == AdminID && message.indexOf('!getmsg') == 0) {
                var getmsg = message.replace('!getmsg ', ''); // apaga 
                    if (getmsg == 'on') {
                        ReceiveMessagesFromBot = true;
                        client.chatMessage(steamID, "Get messages from bot Turned: ON" + "\n" + SPK);
                    } else if (getmsg == 'off') {
                        ReceiveMessagesFromBot = false;
                        client.chatMessage(steamID, "Get messages from bot Turned: OFF" + "\n" + SPK);
                }
            }
});

client.on("friendMessage", function (steamID, message) { // callback 
    if (steamID == AdminID && message.indexOf('!key') == 0) {
                var GetKey = message.replace('!key ', '');  
                client.redeemKey(GetKey); // callback -> result,details,packages
                client.chatMessage(steamID, "Key activated: "+ GetKey + "\n" + SPK);
    } else if (steamID == AdminID && message.indexOf('!reportbug') == 0) {
                var CallNiggas = message.replace('!reportbug ', '');  
                MultipleAdmins(CallNiggas);
        }
});

client.on("friendMessage", function (steamID, message) {
     if (steamID == AdminID && message.indexOf('!non') == 0) {
                var NonSteamGameMsg = message.replace('!non ', ''); 
                var NonSteamGameMsglength = NonSteamGameMsg.length;
                     if (NonSteamGameMsglength > 63) { // maior que 63
                        client.chatMessage(steamID, "Max Custom Name Game exceeded: 63 chars!" + "\n" + SPK);

                     } else if (NonSteamGameMsglength <= 63 && NonSteamGameMsg != 'off') { // menor ou igual que 63
                        SPKad = true;
                        NONSTEAMplay(NonSteamGameMsg);
                        client.chatMessage(steamID, "Now playing: " + NonSteamGameMsg + " and all games in config Turned: ON" + "\n" + SPK);
                    } else if (NonSteamGameMsg == 'off') { // se for off desliga.
                       SPKad = false;
                       client.gamesPlayed([0]);
                       client.chatMessage(steamID, "Now playing: 0 games in config Turned: OFF" + "\n" + SPK);
                   
            }

        }
});
        //_________________________________________________________________________________________
        //  Auto Friend Invite Accept
        client.on('friendRelationship', function (steamID, relationship) {
            if (config.AutoFriendAcceptActivate == "1" && AutoAcceptPendingFriends == true && relationship === 2) {
                var antiscam = steamID.getSteamID64();
                client.getPersonas([antiscam], function(personas) {
                SteamRepAPI.isScammer(antiscam, function (error, result) {
                    if (error) {
                        console.log(error);
                        client.chatMessage(AdminID, error + "\n" + SPK);
                    } else {
                        if (result) { // SCAMMER
                            client.removeFriend(antiscam);
                            client.blockUser(antiscam);
                            client.chatMessage(AdminID, personas[antiscam]["player_name"] + " was automatically deleted, because he is considered a scammer, according to " + 'http://steamrep.com/profiles/'+ antiscam + 
                                                                                            "\n" + SPK);                                                  
                    } else {          // LEGIT
                            client.addFriend(steamID);
                            client.chatMessage(steamID, config.AutoMsgWhenFriendAccept + "\n" + SPK);
                            client.chatMessage(AdminID, personas[steamID]["player_name"] + " was automatically added to your list." + 
                                                        "\nThe records of " + personas[steamID]["player_name"] + " are clean, according to "+ 'http://steamrep.com/profiles/'+ antiscam + 
                                                                                        "\n" + SPK);
                        }
                    }
                });
            });                 // when friend removes ->
                    } else if (relationship === 0) { // config.AutoFriendAcceptActivate == "1" && AutoAcceptPendingFriends == true && 
                    client.getPersonas([steamID], function(personas) {
                    client.chatMessage(AdminID, personas[steamID]["player_name"] + ' Un-friended.' + "\n" + SPK);
                    });
            }
        });
        //_________________________________________________________________________________________
        // Accepts Group
        client.on('groupRelationship', function(groupSteamID, relationship) {
            if (relationship === 2 && groupAutoAccepter == true) {
                
                client.respondToGroupInvite(groupSteamID, true);
                client.chatMessage(AdminID, "Joined Group: " + groupSteamID.getSteamID64() + "!" + "\n" + SPK);//check
            
            } else if (relationship === 2 && groupAutoAccepter == false) {

                client.respondToGroupInvite(groupSteamID, false);
                client.chatMessage(AdminID, "Decline Group Invite: " + groupSteamID.getSteamID64() + "!" + "\n" + SPK);//check
            }
        });

        //_________________________________________________________________________________________
        //   Wallet/NewItems/Comments/TradeOffers
        client.on('wallet', function (hasWallet, currency, balance) {
            Wallet = "Our wallet balance is " + SteamUser.formatCurrency(balance) + "€" + "\n" + SPK;
        });

        client.on('newItems', function (count) {
            if(notifications == true && count != 0)
            client.chatMessage(AdminID, count + " new item(s) in our inventory!" + "\n" + SPK);
        });

        client.on('newComments', function (count) {
            if(notifications == true && count != 0)
            client.chatMessage(AdminID, count + " new comment(s) in our profile!" + "\n" + SPK);
        });

        client.on('tradeOffers', function (count) {
            if(notifications == true && count != 0)
            client.chatMessage(AdminID, count + " new trade offer(s) in our profile!" + "\n" + SPK);
        });
        /*
        client.on('offlineMessages', function (count, friends) { 
            if(notifications == true && count != 0) {
                FlagsChanger("1");
                client.chatMessage(AdminID, count + " new offline messages(s) in our profile! From: [" + friends + "]" + "\n" + SPK);
            }
        });
        */
        
        client.on('groupAnnouncement', function(sid, headline, gid) {
            if(notifications == true)
	        client.chatMessage(AdminID, "\nReceived a group announcement:"+
                                        "\nText: " + headline +
                                        "\nLink: https://steamcommunity.com/gid/" + sid +'/announcements/detail/' + gid +
                                        "\n" + SPK);
        });
        
        client.on('groupEvent', function(sid, headline, date, gid, gameID) {
            if(notifications == true)
	        client.chatMessage(AdminID, "\nReceived a group event:"+
                                        "\nText: " + headline +
                                        "\nDate: " + date + 
                                        "\nGame:" + gameID +
                                        "https://steamcommunity.com/gid/" + sid + "#events/" + gid +
                                        "\n" + SPK);
        }); 
        //_________________________________________________________________________________________
        // Handle errors
        client.on("error", function (e) {
            client.chatMessage(AdminID, "Logon failed, Invalid Password or playing in the account." + "\n" + SPK);
            console.error(Red + "Error: " + Yellow + "Logon failed, Invalid Password or playing in the account.");
    });
//_______________________________________________________________________________________________________________________________
