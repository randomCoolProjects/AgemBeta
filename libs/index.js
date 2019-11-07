var EmKeyboard;
var emailBanned;
var bannedBecause;
var canSendMessages = true;

const loginTimeout = 6500;
const logoutTimeout = 2250;

var interval;

function stopLoading() {
    document.querySelector('#loading').classList.remove('loading');
    document.querySelector('.loading-anim').classList.add('hidden');
}

function startLoading() {
    document.querySelector('#loading').classList.add('loading');
    document.querySelector('.loading-anim').classList.remove('hidden');
}

document.addEventListener("DOMContentLoaded", function (event) {
    {
        var grp = localStorage.getItem('currentGroup');
        if (!grp) grp = 'Global';
        document.title = `${grp} | AgemChat`;
        document.querySelector('#curr_grp').innerHTML = grp;
    }
    var _msg_show = false;
    GoogleFirebase.OnUserAuth = function () {
        if (GoogleFirebase.CurrentUser) {
            document.body.classList.remove("loading");
            var currEmail = GoogleFirebase.CurrentUser.email;
            var ref = GoogleFirebase.GetReference(ROOT + 'adminUser');
            ref.on('value', snap => {
                var emails = snap.val().split('|');
                var isAdmim = false;
                for (var i = 0; i < emails.length; i++) {
                    if (emails[i] == currEmail) {
                        isAdmim = true;
                    }
                }
                if (isAdmim) {
                    LocalResourceCache.LoadResource('libs/admin.js', 'script');
                }
            });
            ref = GoogleFirebase.GetReference(BANPATH + GoogleFirebase.EmailToPath(currEmail));
            ref.on('value', snap => {
                if (snap.val() != null) {
                    emailBanned = true;
                    bannedBecause = snap.val();
                    console.log('Você está banido.');
                }

                CheckForUpdates();
                window.clearInterval(interval);
                windowInterval();
            });
        }
    }

    function windowInterval() {
        if (_msg_show == true)
            return;
        if (!GoogleFirebase.CurrentUser) {
            _msg_show = true;
            swal({
                title: "Oops",
                text: "Você não está logado!",
                icon: "error",
                dangerMode: true,
            })
                .then((val) => {
                    if (val) {
                        window.location = "login.html";
                    }
                });
            canSendMessages = false;
        }
        else if (emailBanned) {
            _msg_show = true;
            swal({
                title: "Oops",
                text: "Você está banido por:\n" + bannedBecause,
                icon: "error",
                dangerMode: true,
            })
            canSendMessages = false;
        }
        if (canSendMessages) {
            var messageInputElement = document.querySelector('#msg');
            messageInputElement.removeAttribute('readonly');
            messageInputElement.classList.remove('not-allowed');
            MessageManager.Init();

        }
        stopLoading();
    }

    interval = window.setInterval(windowInterval, loginTimeout);

    MessageManager.SetElement('messages');

    EmKeyboard = document.querySelector('.emoji-keyb');
    KeyboardLoad();
});

function SendMessage() {
    if (AudioRecorder.Recording)
    {
        AudioRecorder.StopRecording();
        return;
    }

    var msg = $("#msg").val();
    $("#msg").val("");
    MessageManager.SendMessage(msg);
}

function KeyboardLoad() {
    var len = Object.keys(emojis).length;
    for (var i = 0; i < len; i++) {
        var emoji = emojis[i];
        var el = document.createElement('button');
        var html_code = emoji.html.split(';')[0] + ';';
        EmKeyboard.appendChild(el);
        el.classList.add('emoji_button');
        el.innerHTML = html_code;
        el.setAttribute('onclick', 'document.querySelector("#msg").value += "' + emoji.emoji + '";');
    }
    EmKeyboard.addEventListener('mouseover', function () {
        mouseOnKeyboard = true;
    });
    EmKeyboard.addEventListener('mouseout', function () {
        mouseOnKeyboard = false;
    });
    document.body.addEventListener('click', function () {
        if (mouseOnKeyboard) {
            return
        }
        opened = false;
        EmKeyboard.classList.add('hidden');
    }, true);
}

var mouseOnKeyboard = false;
var opened = false;

function EmojiKeyboard() {
    opened = !opened;
    if (opened)
        EmKeyboard.classList.remove('hidden');
    else
        EmKeyboard.classList.add('hidden');
}

function logout() {
    startLoading();
    GoogleFirebase.Logout();
    window.setTimeout(function () {
        window.location = "login.html";
    }, logoutTimeout);
}

var audioCancel = false;
AudioRecorder.RequestMic();
function AudioAction()
{
    const audioBtn = document.querySelector('#audio-btn');
    if (!AudioRecorder.RequestedMic)
    {
        AudioRecorder.RequestMic();
        return;
    }
    if (AudioRecorder.Recording)
    {
        //cancel audio
        audioCancel = true;
        AudioRecorder.StopRecording();
        audioBtn.classList.remove('recording');
        return;
    }

    var success = AudioRecorder.Record(audio64 => {
        if (audioCancel)
        {
            audioCancel = false;
            return;
        }
        audioBtn.classList.remove('recording');
        MessageManager.SendMessage(`<br><audio controls src="${audio64}"></audio>`, true);
    });

    if (success)
    audioBtn.classList.add('recording');
}

var addedFileHandler = false;
function SendFile()
{
    const fileInput = document.querySelector('#file-input');
    if (!addedFileHandler)
    {
        addedFileHandler = true;
        fileInput.addEventListener('change', event => {
            var files = fileInput.files;
            if (!files)
                return;
            
            for (var fileI = 0; fileI < files.length; fileI ++){
                var file = files[fileI];
                let fname = file.name.toLowerCase();
                FileStorage.UploadFile(Date.now() + file.name, file, snap => {
                    snap.ref.getDownloadURL().then(url => {
                        console.log(url);
                        if (
                        fname.endsWith('.png')  ||
                        fname.endsWith('.jpg')  || 
                        fname.endsWith('.jpeg') || 
                        fname.endsWith('.bmp'))
                        {
                            MessageManager.SendMessage(`<div class="img-sim" style="background-image: url('${url}');"></div>`, true);
                        }
                        else
                        {
                            MessageManager.SendMessage(`<b>Arquivo</b><br><a href="${url}" download="${fname}" href="_blank"><button class="btn btn-primary">Download</button></a>`, true);
                        }
                    });
                });
            }
        });
    }

    fileInput.click();

}