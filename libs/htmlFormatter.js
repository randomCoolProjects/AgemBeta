const ProhibedExtensions = [
    '.exe', '.bat', '.sh', '.apk', '.deb', '.rpm'
];

const HtmlFormatter =
{
    FormatBasicMessage: function (Message) // *[bold]* = <b>bold</b>
    {
        var __msg = Message;
        var boldOpen = 0, boldClose = 0;
        while (__msg.includes('*[')) {
            boldOpen++;
            __msg = __msg.replace('*[', '');
        }
        while (__msg.includes(']*')) {
            boldClose++;
            __msg = __msg.replace(']*', '');
        }

        if (boldOpen > 0 && boldOpen == boldClose) {
            while (Message.includes('*[')) {
                Message = Message.replace('*[', '<b>').replace(']*', '</b>');
            }
        }

        return Message;
    },

    FormatResources: function(Message)
    // youtube video url -> video iframe
    // link -> <a href="link">link></a>
    {
        if (Message.includes('http://') || Message.includes('https://') || Message.includes('ftp://'))
        {
            var indexOf = Message.indexOf('http://');
            if (indexOf <= 0) indexOf = Message.indexOf('https://');
            if (indexOf <= 0) indexOf = Message.indexOf('ftp://');

            var endIndexOf = Message.substring(indexOf).indexOf(' ');
            if (endIndexOf <= 0) endIndexOf = Message.length;

            var link = Message.substring(indexOf, indexOf+endIndexOf);

            var danger = false;

            var linkToLow = link.toLowerCase();

            ProhibedExtensions.forEach(item => {
                if (linkToLow.endsWith(item))
                {
                    danger = true;
                    return;
                }
            });

            if (!danger)
            Message = Message.replace(link, `<a href="${link}">${link}</a>`);
            else
            Message = Message.replace(link, `<a href="#" onclick="swal('O link a seguir pode ser perigoso!', {buttons:['Ok', 'Cancelar']}).then(v => {if (!v)window.open('${link}', '_blank');});">${link}</a>`);
        }
        return Message;
    }
};