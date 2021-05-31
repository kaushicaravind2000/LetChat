import firebase from "firebase";

class Fire {
  constructor() {
    this.init();
    this.checkAuth();
  }

  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBxF2_kvAbNUpM3fWBy3jssLvPHs0Qpysk",
        authDomain: "letschat-4b32a.firebaseapp.com",
        projectId: "letschat-4b32a",
        storageBucket: "letschat-4b32a.appspot.com",
        messagingSenderId: "12798451342",
        appId: "1:12798451342:web:2d8c73188cf987303973df",
      });
    }
  };

  checkAuth = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
    });
  };
  send = (messages) => {
    messages.forEach((item) => {
      const message = {
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: item.user,
      };

      this.db.push(message);
    });
  };
  parse = (message) => {
    const { user, text, timestamp } = message.val();
    const { key: _id } = message;
    const createdAt = new Date(timestamp);

    return {
      _id,
      createdAt,
      text,
      user,
      timestamp,
    };
  };

  get = (callback) => {
    this.db.on("child_added", (snapshot) => callback(this.parse(snapshot)));
  };

  off() {
    this.db.off();
  }

  get db() {
    return firebase.database().ref("messages");
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
}

export default new Fire();
