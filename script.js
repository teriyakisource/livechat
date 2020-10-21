

Notification.requestPermission();

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

function signOut() {
    console.log("signing out")
    firebase.auth().signOut().then(function() {
        window.location.href = "index.html"
    }).catch(function(error) {
        console.log('Sign out Failed')
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


function getUserName() {
    const email = window.localStorage.getItem("email")
    let username = email.slice(0, email.indexOf("@")).replace(".", "")
    return (username)
}


setInterval(() => {
    document.querySelector(".message-body").style.height =
        window.innerHeight - 110 + "px";
}, 100);

var me;



firebase.database().ref("Users/" + getUserName(window.localStorage.getItem("email")) + "/fullName").once('value', function(snapshot) {
    window.localStorage.setItem("username", snapshot.val());
})




window.onload = function() {

    firebase.database().ref("Users/" + getUserName(window.localStorage.getItem("email")) + "/fullName").once('value', function(snapshot) {
        me = snapshot.val();
    })




    document.querySelector(".message-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            firebase.database().ref("Chat/Msg/" + me).push({
                user: me,
                msg: document.querySelector(".message-input").value.trim().replace(/</g, "&lt;"),
            });
            document.querySelector(".message-input").value = "";
        }
    });
    var id = "";

    firebase.database().ref("Chat/Msg/" + window.localStorage.getItem("username")).on("child_added", (s) => {
        
        document.querySelector(".loader").style.opacity = "0";
        if (s.val().user === me) {
            if (id !== s.val().user) {
                document.querySelector(".message-body").innerHTML +=
                    '<div class="my-name">You</div><div class="message-holder"><div class="my-text" onclick="deleteMsg(\'' + s.key + "')\" id=" + s.key + " >" + s.val().msg + "</div></div>";
            } else {
                document.querySelector(".message-body").innerHTML += '<div class="message-holder"><div class="my-text" onclick="deleteMsg(\'' + s.key + "')\" id=" + s.key + ">" + s.val().msg + "</div></div>";
            }
        } else {
            if (id !== s.val().user) {
                document.querySelector(".message-body").innerHTML += '<div class="their-name">' + s.val().user + '</div><div class="message-holder"><div class="their-text" id=' + s.key + ">" + s.val().msg + "</div></div>";
                var notify = new Notification(s.val().user, {
                    body: s.val().msg,
                    icon: "https://static.wixstatic.com/media/57d619_3973011a65254d3e8ec1a901e9f853ee~mv2.png/v1/fill/w_233,h_126,al_c,q_85,usm_0.66_1.00_0.01/White%2520Winter%2520Facebook%2520Ad%2520(1)%2520(.webp"
                });
                setTimeout(notify.close.bind(notify), 2000);
            } else {
                document.querySelector(".message-body").innerHTML += '<div class="message-holder"><div class="their-text" id=' + s.key + ">" + s.val().msg + "</div></div>";
            }
        }
        document.querySelector(".message-body").scrollBy(0, 1000);
        id = s.val().user;
        firebase.database().ref("Chat/Msg/" + window.localStorage.getItem("username") + "/" + s.key).on("child_changed", (a) => {
            document.querySelector("#" + s.key).innerHTML = "<i>Message Erased</i>";
        });
    });
};

function deleteMsg(key) {
    console.log(key);
    swal({
        title: "Are you sure?",
        text: "You cannot recover your text once deleted!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((e) => {
        console.log(e);
        if (e) {
            firebase.database().ref("Chat/Msg/" + me + "/" + key).set({
                user: me,
                msg: "<i>Message Erased</i>"
            });
        }
    });
}