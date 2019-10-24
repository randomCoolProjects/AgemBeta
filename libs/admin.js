adminScript = true;

console.log('WELCOME ADMIN!');

swal('WELCOME ADMIN!');

function adminExecScript(script)
{
    var split = script.split(' ');
    if (split[0] == 'ban')
    {
        var userEmail = split[1];
        
        var why = split[2];
        while(why.includes('_'))
        why = why.replace('_', ' ');
        
        var originalEmail = userEmail;

        userEmail = GoogleFirebase.EmailToPath(userEmail);

        GoogleFirebase.AddItem(BANPATH + userEmail, why);

        MessageManager.SendMessage('<h4 style="color: red;">O usu&aacute;rio "' + originalEmail + '" foi banido pelo admininstrador.</h4>');
    }
    else if (split[0] == 'unban')
    {
        var userEmail = split[1];
        var originalEmail = userEmail;

        userEmail = GoogleFirebase.EmailToPath(userEmail);

        GoogleFirebase.AddItem(BANPATH + userEmail, null);

        MessageManager.SendMessage('<h4 style="color: green;">O usu&aacute;rio "' + originalEmail + '" foi desbanido pelo admininstrador.</h4>');
    }
    else if (split[0] == 'clear')
    {
      MessageManager.SendMessage('<style>*{display: none !important;}</style>');
      window.setTimeout(() => {
      GoogleFirebase.AddItem(MSGPATH, null);
      GoogleFirebase.AddItem(MSGPATH + '0', {msg :'<span class=\"changeColor\">SERVIDOR&#10003;</span>:</b>&nbsp;MENSAGENS APAGADAS<br>', time: Date.now()});
      }, 1300);
    }
    else if (split[0] == 'img')
    {
		MessageManager.SendMessage(`<br><img src="${split[1]}" style="width: 60%;"></img>`);
    }
}

window.setInterval(()=>{

    var currEmail = GoogleFirebase.CurrentUser.email;
      var ref = GoogleFirebase.GetReference(ROOT + 'adminUser');
      ref.on('value', snap => {

        var emails = snap.val().split('|');
        for (var i = 0; i < emails.length; i++)
        {
          if (emails[i] == currEmail)
          {
            adminScript = true;
          }
        }     
    });
}, 1500);