
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
        this.Mode = 'ONLINE';
        this.NameId = '';
        this.Index = 0;
        this.Element = null;
        this.Path = GroupManager.CurrentMSGPath();
        this.Loading = true;
        this.CanCheckForNewMessages = false;
        this.__count_cache = 0;
    }

    GetMessageCount(callback)
    {
        if (this.Mode == 'OFFLINE')
        {
            callback(Number(localStorage.getItem('msgcount') || 0));
            return;
        }
        GoogleFirebase.GetValueOnce(GroupManager.CurrentGroupPath() + 'msgcount', val => {
            var num = Number(val);
            if (num != this.__count_cache)
            {
                localStorage.setItem(this.Path + 'msgcount', num);
                this.__count_cache = num;
            }
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
        else if (!allowHtml) // if not admin, prevent HTML
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
        var cache = new Array();
        var count = (localStorage.getItem(this.Path + 'msgcount'));

        if (count && localStorage.getItem(this.Path + '0'))
        {
            count = Number(count);
            for (var i = 0; i < count; i ++)
            {
                if (i == count) break;
                cache[i] = JSON.parse(localStorage.getItem(this.Path + i.toString()));
            }
            console.log('Loaded messages from cache.', cache);
            callback(cache);
        }
        else
        GoogleFirebase.GetValueOnce(this.Path, msg => {
            console.log('Loaded messages from database.', msg);

            if (!msg)
            {
                callback(null);
                return;
            }

            // Now, write to cache
            var values = msg;
            //if (typeof values == Object)values = Object.values(msg);
            //else values = msg;
            for (var i = 0; i < values.length; i ++)
            {
                if (i == values.length) break;
                var value = values[i];
                localStorage.setItem(this.Path + i, JSON.stringify(value))
            }
            callback(msg);
        });
        //TODO: load from cache (localStorage)
    }

    GetMessage(index, callback)
    {
        GoogleFirebase.GetValueOnce(this.Path + index, msg => {
            if (msg == null)
            {
                callback(null);
                return null;
            }
            localStorage.setItem(this.Path + index, JSON.stringify(msg));
            callback(msg);
        });
    }

    CheckForErrors(virtualCount, realCount)
    {
        if (this.Mode == 'ONLINE')
        if (virtualCount > realCount)
        {
            localStorage.removeItem(this.Path + 'msgcount');
            console.error('Oh, no');
            for (var i = 0; i < virtualCount; i ++)
            {
                localStorage.removeItem(this.Path + i);
            }
            location.reload();
        }
    }

    DisplayMessageArray(messages)
    {
        var keys = Object.keys(messages);
        var values = Object.values(messages);

        this.GetMessageCount(count => {
            this.CheckForErrors(keys.length, count);
            for (this.Index = 0; this.Index < keys.length; this.Index++)
            {
                var message = values[this.Index];
                console.log('[DisplayMessageArray]',`${this.Index} = ${message}`);
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
                console.log('MSGREQUEST:',count-1,this.Index);
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

    Init(mode) {

        if (mode) this.Mode = mode;

        this.GetAllMessages(messages => {

            if (mode == 'OFFLINE')
            {
                this.NameId = localStorage.getItem('name-id-cache');
            }

            if (messages)
            {
                this.DisplayMessageArray(messages);
                this.ScrollBottom(true);
            }

            if (mode == 'OFFLINE') {
                return;
            }

            this.NameId = GoogleFirebase.CurrentUser.displayName;
            if (localStorage.getItem('name-id-cache') != this.NameId)
            localStorage.setItem('name-id-cache', this.NameId);

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
