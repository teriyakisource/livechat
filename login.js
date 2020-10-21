

var firebaseConfig = {
    apiKey: "AIzaSyCquGd_ivIEsGUrkKzRp_VFCBebMO3Ne0k",
    authDomain: "livechat-87c6b.firebaseapp.com",
    databaseURL: "https://livechat-87c6b.firebaseio.com",
    projectId: "livechat-87c6b",
    storageBucket: "livechat-87c6b.appspot.com",
    messagingSenderId: "305064076493",
    appId: "1:305064076493:web:9eb6b9506786f33e6fb584"
};

firebase.initializeApp(firebaseConfig);


function logIn() {

    var email = document.getElementById("email").value;
    window.localStorage.setItem('email', email);
    var password = document.getElementById("password").value;
    console.log(email, password)

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        alert(error.message)
    });
}



firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var username = user.email;
        window.username = username;
        window.location.href = "chat.html";
    }
});