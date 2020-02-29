import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

let prefix = process.env.PREFIX || '!manco'

let playersList = [

  {
    nick: 'MesieeecL',
    accountId: 'account.049625e5c79948f090a19376875ac297'
  },
  {
    nick: 'dresan21',
    accountId: 'account.638a07004b2547dab642c0728a77629b'
  },
  {
    nick: 'ZovycK',
    accountId: 'account.e66e240fe22546489da4f1ba4f28dc0e'
  },
  {
    nick: 'Segoviano_',
    accountId: 'account.5862758573d84c22bbfe53f7e76bc942'
  },
  {
    nick: 'rapso',
    accountId: 'account.d04421dd9e6944db9479f8a19fc97411'
  },
  {
    nick: 'm0n0TX',
    accountId: 'account.98a44aa0f0294b70a17addcfc038acb0'
  },
  {
    nick: 'GATODELPIO',
    accountId: 'account.8d4bd71654fe4132b607ab227b6980cc'
  },
  {
    nick: 'TedOsental',
    accountId: 'account.3b50788fc1aa4dbda70dec2599b9910a'
  },
  {
    nick: 'TiROaLaiR3',
    accountId: 'account.cdcaedd9a2044fa58b90159c99ebcec5'
  },
  {
    nick: 'Goroum',
    accountId: 'account.7081c11b7a1243a2ad94e0946bf53182'
  }
]

const pubgAPI = axios.create({
  headers: {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1MGVmOGNhMC0zMjVkLTAxMzgtMzBkMS0xMWRiZTRiMWZlZmUiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTgxNzk3NTA2LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImRzZWdvdmlhb2xpdmFyIn0.XgETpyQXQaC3hwEuGjO3e0W96sT_nWKFp5g3y_GJAZ0',
    'Accept' : 'application/vnd.api+json'
  }
})


function messageListener(message){

  if(!message){
    return false
  }

  if(message.content.startsWith(prefix) && !message.author.bot){

    const args = message.content.split(' ')

    let extendedArgs = []

    for(let i = 0 ; i < args.length ; i++){
      if(args[i] && i != 0){
        extendedArgs.push(args[i].toLowerCase())
      }
    }

    switch(extendedArgs[0]){

      case 'serverinfo':
        message.channel.send(`This server's name is: ${message.guild.name} \n Total members: ${message.guild.memberCount}`)
        break

      case 'pubg':
        getPubgTops(message, extendedArgs)
        break

      default:
        message.channel.send(`The command you entered is invalid`)
        break

    }

  }
  
  return true

}

async function getPubgTops(message, extendedArgs){
  try{

    let gameMode = 'squad'

    switch(extendedArgs[1]){

      case 'squad':
        gameMode = 'squad'
        break

      case 'duo':
        gameMode = 'duo'
        break

      case 'solo':
        gameMode = 'solo'
        break

    }

    let baseURL = `https://api.pubg.com/shards/steam/seasons/division.bro.official.pc-2018-06/gameMode/${gameMode}/players/?filter[playerIds]=`

    let preppedURL = baseURL + playersList.map(player => player.accountId).join(',')

    const resp = await pubgAPI.get(preppedURL)

    
    if(resp.data){

      let formattedResp = []

      //assign data to each player
      resp.data.data.forEach(player => {

        let foundIndex = playersList.findIndex(playerInList => playerInList.accountId == player.relationships.player.data.id)

        if(foundIndex != -1){

          formattedResp.push({
            playername: playersList[foundIndex].nick,
            kills: player.attributes.gameModeStats.squad.kills,
            deaths: player.attributes.gameModeStats.squad.losses,
            kd: (player.attributes.gameModeStats.squad.kills/player.attributes.gameModeStats.squad.losses).toFixed(3),
            matches: player.attributes.gameModeStats.squad.roundsPlayed,
            wins: player.attributes.gameModeStats.squad.wins,
            revives: player.attributes.gameModeStats.squad.revives,
            teamkills: player.attributes.gameModeStats.squad.teamKills
          })

        }

      })

      //sort by kd
      formattedResp.sort((a, b) => b.kd - a.kd)

      //set emojis
      if(formattedResp.length > 2){
        formattedResp[0].playername = '🥇' + formattedResp[0].playername
        formattedResp[1].playername = '🥈' + formattedResp[1].playername
        formattedResp[2].playername = '🥉' + formattedResp[2].playername
      }

      formattedResp[formattedResp.length - 1].playername = '💩' + formattedResp[formattedResp.length - 1].playername

      //format and send to discord table
      let mappedNicks = formattedResp.map(player => player.playername).join('\n')
      let mappedKDS = formattedResp.map(player => player.kd).join('\n')
      let mappedWinMatch = formattedResp.map(player => player.wins + '/' + player.matches).join('\n')
      let mappedWins = formattedResp.map(player => player.wins).join('\n')
      let mappedRevives = formattedResp.map(player => player.revives).join('\n')
      let mappedTeamkills = formattedResp.map(player => player.teamkills).join('\n')

      let extendedStats = (extendedArgs[2] == 'extended') ? true : false

      let fields = [
        { name: "Nombre", value: mappedNicks, inline: true},
        { name: "K/D", value: mappedKDS, inline: true},
        { name: "🍗/Partidas", value: mappedWinMatch, inline: true}
      ]

      if(extendedStats){
        fields.push(
          { name: "Pollitos", value: mappedWins, inline: true},
          { name: "Revividos", value: mappedRevives, inline: true},
          { name: "# Traiciones", value: mappedTeamkills, inline: true}
        )
      }

      message.channel.send({
        embed: {
          color: 3447003,
          title: `Los kd's del ManZooTeam (${gameMode}):`,
          fields: fields
        }
      })

    }else{
      message.channel.send(`La API de PUBG valió caquita`)
    }

  }catch(e){
    console.log(e)
  }
}




export default messageListener