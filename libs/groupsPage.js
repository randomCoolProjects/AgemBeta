var bodyHtml = '';
function CreateGroupElement(name, owner) {
    var html = `<div class="group" onclick="GotoGroup('${name}');">
    <span class="group-name">${name}</span>
    <span class="group-owner">${owner}</span>
    </div>`;
    bodyHtml += html;
}

function GotoGroup(name) {
    if (GroupManager.AcceptedEnter(name, joined => {
        if (joined) {
            localStorage.setItem('currentGroup', name);
            location.href = 'index.html';
        }
        else {
            swal({
                title: "Erro",
                text: "Você [ainda] não foi aceito neste grupo.",
                icon: "error",
                dangerMode: true,
            });
        }
    }));
}

const loginTimeout = 6500;
var interval;
var emailBanned;
var canSendMessages = true;
var actionBtn;

function stopLoading()
{
  document.querySelector('#loading').classList.remove('loading');
  document.querySelector('.loading-anim').classList.add('hidden');
}

function startLoading()
{
  document.querySelector('#loading').classList.add('loading');
  document.querySelector('.loading-anim').classList.remove('hidden');
}

document.addEventListener("DOMContentLoaded", function (event) {
    actionBtn = document.querySelector('.action-btn');
    actionBtn.addEventListener('click', groupWizard);
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

            const GroupsElement = document.querySelector('#groups');
            var bhtm = GroupsElement.innerHTML;

            GroupManager.GetJoinedGroups(value => {
                bodyHtml = '';
                if (!value) return;
                var keys = Object.keys(value);
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    var v = value[k];
                    CreateGroupElement(k, v);
                }
                GroupsElement.innerHTML = bhtm + bodyHtml;
            });

            GroupManager.CheckEnterRequests();
        }
        stopLoading();
    }

    interval = window.setInterval(windowInterval, loginTimeout);
});

function groupWizard()
{
    swal('Criar um grupo ou entrar em um?', 'O que você quer?', {
        icon: 'info',
        buttons: {
            create: {
                text: 'Criar um grupo',
                value: 'create'
            },
            join: {
                text: 'Entrar em um grupo',
                value: 'join'
            }
        },
    }).then((btn) => {
        if (btn == 'join') join_action();
        if (btn == 'create') create_action();
    });

    function join_action()
    {
        swal('Group name:', {
            title: 'Entrar em um grupo',
            icon: 'info'
        }).then((v) => {
            if (!v) return;
            var groupName = document.querySelector('#grp_name').value;
            if (!groupName || groupName.includes('.') || groupName.includes('@') || groupName.includes('#') || groupName.includes('$'))
            {
                swal('Nome inválido!', 'Erro', 'error');
                return;
            }
            GroupManager.JoinGroup(groupName, success => {
                if (!success)
                {
                    swal('Um erro ocorreu.', 'Erro', 'error');
                    return;
                }
                else
                {
                    swal('Agora, espere o criador do grupo aceitar você.',
                    'Solicitação enviada!', 'success').then(() => {
                        location.reload();
                    });
                }
            });
        });
        document.querySelector('.swal-text').innerHTML = 'Nome do grupo:<br><input id="grp_name" placeholder="Digite um nome" autofocus>';
    }

    function create_action()
    {
        swal('Group name:', {
            title: 'Criar um grupo',
            icon: 'info'
        }).then((v) => {
            if (!v) return;
            var groupName = document.querySelector('#grp_name').value;
            if (!groupName || groupName.includes('.') || groupName.includes('@') || groupName.includes('#') || groupName.includes('$'))
            {
                swal('Nome inválido!', 'Erro', 'error');
                return;
            }
            GroupManager.CreateGroup(groupName, success => {
                if (!success)
                {
                    swal('Ocorreu um erro ao criar o grupo.', 'Erro', 'error');
                }
                else
                {
                    swal('O grupo foi criado com sucesso.', 'Sucesso', 'success').then(() => {
                        localStorage.setItem('currentGroup', groupName);
                        location.href = 'index.html';
                    });
                }
            });
        });
        document.querySelector('.swal-text').innerHTML = 'Nome do grupo:<br><input id="grp_name" placeholder="Digite um nome" autofocus>';
    }
}