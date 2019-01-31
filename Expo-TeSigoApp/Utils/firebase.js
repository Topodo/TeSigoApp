import * as firebase from 'firebase'

class Firebase {
    static init() {
        firebase.initializeApp({
            apiKey: "AIzaSyBXE1C3MW-MQ4P5-NH3jy_wUy5lGFyD8A0",
            authDomain: "tesigoapp.firebaseapp.com",
            databaseURL: "https://tesigoapp.firebaseio.com",
            storageBucket: "tesigoapp.appspot.com",
        })
    }
}

module.exports = Firebase