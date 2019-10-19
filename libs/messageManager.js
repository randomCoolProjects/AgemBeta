
var notf = false;
//Push.Permission.request(onGranted, onDenied);
function onGranted() {
    notf = true;
}

function onDenied() {
    notf = false;
}

var iSend = false; // I sent the message

function htmlEscape(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function getDateString(customDate) {
    var date = new Date(customDate);

    var min = date.getMinutes();
    var ho = date.getHours();

    var minutes = '00';
    var hour = '00';

    if (min < 10)
        minutes = '0' + min.toString();
    else
        minutes = min.toString();

    if (ho < 10)
        hour = '0' + ho.toString();
    else
        hour = ho.toString();

    var nd = new Date(date);
    var mm = nd.getMonth() + 1;
    var y = nd.getFullYear();
    var dd = date.getDate();

    var m;
    var d;

    if (mm < 10)
    m = '0' + mm;
    else
    m = mm;

    if (dd < 10)
    d = '0' + dd;
    else
    d = dd;

    var dateStr = (d) + '/' + m + '/' + y + '-' + hour + ':' + minutes;
    return dateStr;
}

const recivedAudio = new Audio('https://github.com/randomCoolProjects/MasterChat/raw/master/notf.wav');
const sentAudio = new Audio('https://raw.githubusercontent.com/randomCoolProjects/MasterChat/master/sound/sent.wav');

class msgManager {
    constructor() {
        this.Sensore = true;
        this.Index = 0;
        this.Element = null;
        this.ref = GoogleFirebase.GetReference(MSGPATH);
        this.ref.on('value', snap => {
            var msg = snap.val();

            if (!iSend) {
                recivedAudio.play();
            }
            else {
                sentAudio.play();
            }
            this.ShowMessage(msg);
        });
    }

    ShowMessage(
        value // all messages
        ) {

        var keys = Object.keys(value);
        var values = Object.values(value);

        if (keys.length <= this.Index)
        {
            location.reload();
            return;
        }
        for (this.Index = this.Index; this.Index < keys.length; this.Index++)
        {
            if (this.Sensore)
            var msg = sensore(values[this.Index].msg);
            else
            var msg = values[this.Index].msg;

            var messageElement = document.createElement('span');

            this.Element.appendChild(messageElement);
            var dateStr = getDateString(Number(values[this.Index].time));
            //messageElement.setAttribute('dateHtml', dateStr);

            messageElement.classList.add('tooltipcontainer');

            messageElement.innerHTML = '<b>' + msg;

            var tooltipDateElement = document.createElement('span');
            tooltipDateElement.classList.add('tooltiptext');

            tooltipDateElement.innerHTML = dateStr;
            tooltipDateElement.classList.add('tooltiptext');

            messageElement.appendChild(tooltipDateElement);

            //Scroll to bottom
            var scrollingElement = this.Element;
            scrollingElement.scrollTop = scrollingElement.scrollHeight;

            iSend = false;
        }
    }

    SetElement(element) {
        this.Element = document.querySelector('#' + element);
    }

    SendMessage(message) {

        if (message == '' || message == null || message.length <=0 || !canSendMessages) return;

        var Message = message;
        iSend = true;

        var extra1 = '', extra2 = '';

        if (adminScript)
        {
            if (Message.substring(0, 2) == '//')
            {
                adminExecScript(Message.substring(2));
                return;
            }
            extra1 = '<span class="changeColor">'
            extra2 = ' - Administrador&#10003;</span>';
        }
        else // if not admin, prevent HTML
        {
            Message = 
            HtmlFormatter.FormatResources(
                HtmlFormatter.FormatBasicMessage(
                    htmlEscape(Message)
                )
            );
        }

        var msgStr = extra1 + GoogleFirebase.CurrentUser.displayName + extra2 + ':</b>&nbsp;' + Message + '<br>';
        var id = this.Index;
        // console.log("Sending a new message ", msgStr);
        GoogleFirebase.AddItem(MSGPATH + id, {msg :msgStr, time: Date.now()});
        GoogleFirebase.GetReference(MSGPATH).orderByKey();
    }

    Init()
    {
        /*if (localStorage.getItem('messages'));else return;
        this.Element.innerHTML = localStorage.getItem('messages');
        this.Index = Number(localStorage.getItem('index'));*/
    }
}

var MessageManager = new msgManager();
