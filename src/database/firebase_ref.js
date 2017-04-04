/*eslint-env node */

import firebase from "firebase";

firebase.initializeApp({
    apiKey: "AIzaSyD_xT2uE82MaQL08P_BshM-q7bbPMejlWE",
    authDomain: "frame-155310.firebaseapp.com",
    databaseURL: "https://frame-155310.firebaseio.com"
});

export var ref = firebase.database().ref("demo/frameModel");

function setRef(ref) {
    module.exports.ref = firebase.database().ref(ref);
    if (typeof module.exports.onRefChanged === "function") {
        module.exports.onRefChanged();
    }
}
setRef("demo/frameModel");

export function signInAnonymously() {
    firebase.auth().signInAnonymously().catch(function(error) {
        console.log(error.code);
        console.log(error.message);
    });
}

export function signIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
    });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var path = "userdata/" + user.uid + "/frameModel";
        firebase.database().ref(path).once("value").then(function(snapshot) {
            if (!snapshot.exists()) {
                firebase.database().ref("demo/frameModel").once("value").then(function(snap) {
                    firebase.database().ref(path).set(snap.val()).then(function() {
                        setRef(path);
                        
                    });
                });
            } else {
                setRef(path);
            }
        });
    } else {
        setRef("demo/frameModel");
    }
});