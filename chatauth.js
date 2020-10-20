function signOut() {
    console.log("signing out")
    firebase.auth().signOut().then(function() {
        window.location.href = "index.html"
    }).catch(function(error) {
        console.log('Signed out Failed')
        alert(error.message)
    });
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var username = user.email;
        window.username = username;
        console.log("logged in");


    } else {

        window.location.href = "index.html"

    }
});