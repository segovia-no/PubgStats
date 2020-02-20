import firestoreconnector from './firestoreconnector'

const maintenance = {

  updateUsersfromServers: () => {

    //update subscribed user's channels
    firestoreconnector.collection('users').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data())
      })
    })
    .catch((err) => {
      console.log('Error getting documents', err)
    })

  }


}

export default maintenance