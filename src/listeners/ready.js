let prefix = process.env.PREFIX || '!'

function readyListener(client){

	console.log('Successfully connected to Discord!')

  if(!client){
    return false
  }

  //get all subscribed guilds
	/*client.guilds.forEach((guild) => {
		console.log("Guild: " + guild.name)

		console.log('Members:')
		guild.members.forEach(member => {

			client.fetchUser(member)
				.then(user => {
					console.log(user)
				})

		})

  })*/
  
  return true

}

export default readyListener