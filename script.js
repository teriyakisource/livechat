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

setInterval(() => {
    document.querySelector(".message-body").style.height =
        window.innerHeight - 110 + "px";
}, 100);

var me = "";
window.onload = function() {
    swal({
        text: "Enter your name",
        content: "input",
        button: {
            text: "Go!",
            closeModal: true,
        },
        allowOutsideClick: false,
        closeOnClickOutside: false,
    }).then((value) => {
        if (value.trim() == "") {
            window.location.reload();
            return;
        }
        me = value;
        document.querySelector(".message-input").addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                firebase.database().ref("Chat/Msg").push({
                    user: me,
                    msg: document
                        .querySelector(".message-input")
                        .value.trim()
                        .replace(/</g, "&lt;"),
                });
                document.querySelector(".message-input").value = "";
            }
        });
        var id = "";
        firebase.database().ref("Chat/Msg").on("child_added", (s) => {
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
                } else {
                    document.querySelector(".message-body").innerHTML += '<div class="message-holder"><div class="their-text" id=' + s.key + ">" + s.val().msg + "</div></div>";
                }
            }
            document.querySelector(".message-body").scrollBy(0, 1000);
            id = s.val().user;
            firebase.database().ref("Chat/Msg/" + s.key).on("child_changed", (a) => {
                document.querySelector("#" + s.key).innerHTML = "<i>Message Erased</i>";
            });
        });
    });
    document.querySelector(".swal-content__input").placeholder = "e.g. bruh";
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
            firebase.database().ref("Chat/Msg/" + key).set({
                user: me,
                msg: "<i>Message Erased</i>"
            });
        }
    });
}