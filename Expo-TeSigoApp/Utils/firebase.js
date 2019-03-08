import * as firebase from 'firebase'

class Firebase {
    static init() {
        firebase.initializeApp({
            apiKey: "AIzaSyBXE1C3MW-MQ4P5-NH3jy_wUy5lGFyD8A0",
            authDomain: "tesigoapp.firebaseapp.com",
            databaseURL: "https://tesigoapp.firebaseio.com",
            projectId: "tesigoapp",
            storageBucket: "tesigoapp.appspot.com",
            messagingSenderId: "964052480309"
        })
    }
}

module.exports = Firebase