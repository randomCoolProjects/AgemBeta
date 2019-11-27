
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

const recivedAudio = new Audio('data:audio/wav;base64,' + LocalResourceCache.GetResource('audio/notf.base64'));
const sentAudio = new Audio('data:audio/wav;base64,' + LocalResourceCache.GetResource('audio/sent.base64'));

class msgManager {
    constructor() {
        this.NameId = '';
        this.Index = 0;
        this.Element = null;
        this.Path = GroupManager.CurrentMSGPath();
        this.Loading = true;
        this.CanCheckForNewMessages = false;
    }

    GetMessageCount(callback)
    {
        if (!ONLINE) {
            callback(Number(CacheParser.GetItemRaw(GroupManager.CurrentGroupPath() + 'msgcount')));
            return;
        }
        GoogleFirebase.GetValueOnce(GroupManager.CurrentGroupPath() + 'msgcount', val => {
            var num = Number(val);
            callback(Number(num || 0));
        });
    }

    GetFormattedContent(message)
    {
        if (!
            message.type ||
            message.type != 'text' &&
            message.type != 'image' &&
            message.type != 'audio' &&
            message.type != 'file')
            {
                swal({title: 'Erro', text: 'Um erro ocorreu. Type='+message.type, icon: 'error'});
                return null;
            }

        if (message.type == 'text')
            return message.content;
        if (message.type == 'image')
            return `<div class="img-sim" style="background-image: url('${message.content}');" onclick="showImage('${message.content}');"></div>`;
        if (message.type == 'audio')
            return `<audio controls src="${message.content}"></audio>`;
        if (message.type == 'file')
            return `<b>Arquivo</b><br><a href="${message.content}" download><button class="btn btn-primary">Download</button></a>`;

        return null;
    }

    CreateMessageElement(message) // Returns: HTML code for the message
    {
        /*
         message {
             content: 'content',
             time: time,
             sender: sender,
             type: 'image|audio|file|text'
         }
        */

         const html =
         `<span class="message"><span class="msg-owner" sender="${message.sender}">${message.sender}&nbsp;[${getDateString(message.time)}]`
         + `</span><span class="msg-content">${this.GetFormattedContent(message)}</span></span>`;

         var element = document.createElement('div');
         element.classList.add('msg-container')
         element.innerHTML = html;

         if (message.sender == this.NameId)
            element.classList.add('msg-container-my');

        return element;
        
    }

    DisplayMessage(message)
    {
        if (!this.Loading)
        {
            if (!this.Loading && message.sender != this.NameId && !document.hasFocus())
            {
                var content = message.content;
                var img = '/img/AgemChat_Logo.png';
                if (message.type == 'audio')
                {
                    content = '🎤 Audio';
                }
                else if (message.type == 'image')
                {
                    content = 'Imagem';
                    img = message.content;
                }
                else if (message.type == 'file')
                {
                    content = '📎 Arquivo';
                }
                Push.create('🗨 ' + message.sender, {
                    body: content,
                    icon: img,
                    timeout: 3500,
                    onClick: function() {
                        window.focus();
                    }
                });
            }

            if (message.sender == this.NameId)
                sentAudio.play();
            else
                recivedAudio.play();
        }

        var element = this.CreateMessageElement(message);
        this.Element.appendChild(element);

        var shareTxt = message.type =='text' ? message.content :
        (message.type == 'image' ? message.content : '');

        element.setAttribute('share', shareTxt);

        function showShareDialog() {
            LocalResourceCache.LoadCustomElement('share', document.body, () => {
                document.querySelector('.share').classList.remove('hidden');
                SHARE_TEXT = shareTxt;
            });
        }

        var timeout = null;

        var clickStart = function(mouse) {
            DEBUG(mouse.button)
            if (mouse == 'TOUCH' || mouse.button == 0)
            timeout = window.setTimeout(() => {
                showShareDialog();
            }, 750);
        }

        var clickEnd = function(mouse) {
            DEBUG('mouseup!')
            if (timeout) window.clearTimeout(timeout);
        }

        element.addEventListener('mousedown', clickStart);
        element.addEventListener('mouseup', clickEnd);

        element.addEventListener('touchstart', () => {
            clickStart('TOUCH');
        });
        element.addEventListener('touchend', clickEnd);

        

        this.ScrollBottom();

    }

    ScrollBottom(fast)
    {
        var scrollingElement = this.Element;
        if (fast)
        {
            scrollingElement.scrollTop = scrollingElement.scrollHeight;
            return;
        }
        let last = scrollingElement.scrollTop;
        var scrollInterval = window.setInterval(() => {
            scrollingElement.scrollTop+=3;
            if (last == scrollingElement.scrollTop)
            window.clearInterval(scrollInterval);
            last = scrollingElement.scrollTop
        }, 1);
    }

    SetElement(element) {
        this.Element = document.querySelector('#' + element);
    }

    SendMessage(message, allowHtml, type) {

        if (message == '' || message == null || message.length <= 0 || !canSendMessages) 
        {
            console.error(message, 'Is invalid.');
            return;
        }

        var Message = message;
        iSend = true;

        if (adminScript) {
            if (Message.substring(0, 2) == '//') {
                adminExecScript(Message.substring(2));
                return;
            }
        }
        else if ((!allowHtml || !adminScript) && type == 'text') // if not admin, prevent HTML
        {
            Message =
                HtmlFormatter.FormatResources(
                    HtmlFormatter.FormatBasicMessage(
                        htmlEscape(Message)
                    )
                );
        }

        this.GetMessageCount(count => {
            GoogleFirebase.AddItem(GroupManager.CurrentMSGPath() + count,
            {
                content: Message,
                time: Date.now(),
                sender: this.NameId,
                type: type || 'text'
    
            });
            GoogleFirebase.AddItem(GroupManager.CurrentGroupPath() + 'msgcount', count+1);
        });

        GoogleFirebase.OrderByKey(this.Path);
    }

    GetAllMessages(callback)
    {
        GoogleFirebase.GetValueOnce(this.Path, msg => {
            DEBUG('Loaded messages from database.', msg);

            if (!msg)
            {
                callback(null);
                return;
            }
            callback(msg);
        });
    }

    GetMessage(index, callback)
    {
        GoogleFirebase.GetValueOnce(this.Path + index, msg => {
            if (msg == null)
            {
                callback(null);
                return null;
            }
            callback(msg);
        });
    }

    CheckForErrors(virtualCount, realCount)
    {
        if (virtualCount > realCount && ONLINE)
        {
            console.error('Oh, no');
            CacheParser.RemoveItem(GroupManager.CurrentGroupPath() + 'msgcount');
            CacheParser.RemoveItem(this.Path);
            location.reload();
        }
    }

    DisplayMessageArray(messages)
    {
        var keys = Object.keys(messages);
        var values = Object.values(messages);

        this.GetMessageCount(count => {
            this.CheckForErrors(keys.length, count);
            DEBUG(`Index = ${this.Index}, Msgs = ${keys.length}`);
            for (this.Index = 0; this.Index < keys.length; this.Index++)
            {
                var message = values[this.Index];
                if (this.Index == keys.length || !message) break;
                this.DisplayMessage(message);
            }
            this.Index--;
        });
    }

    ReciveMessages()
    {
        this.CanCheckForNewMessages = false;
        this.GetMessageCount(count => {

            this.CheckForErrors(this.Index, count);

            if (count-1 > this.Index)
            {
                DEBUG('MSGREQUEST:',count-1,this.Index);
                this.GetMessage(this.Index+1, message => {
                    this.CanCheckForNewMessages = true;
                    if (!message) {
                        console.error('The message is null.');
                        return;
                    }
                    this.Index++;
                    this.DisplayMessage(message);
                });
            }
            else
            this.CanCheckForNewMessages = true;
        });
    }

    Init() {

        this.NameId = GoogleFirebase.CurrentUser.displayName;

        this.GetAllMessages(messages => {

            if (messages)
            {
                DEBUG('displaying messages...');
                this.DisplayMessageArray(messages);
                this.ScrollBottom(true);
            }

            if (!ONLINE) {
                DEBUG('MsgMgr: Offline');
                return;
            }

            this.CanCheckForNewMessages = true; // Allow checking for new messages

            window.setTimeout(() => {
                this.Loading = false;

                window.setInterval(() => {
                    if (this.CanCheckForNewMessages)
                        this.ReciveMessages();
                }, 50);

            }, 150);
        });
    }
}

var MessageManager = new msgManager();
