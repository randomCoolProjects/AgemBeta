const GroupManager =
{
    CurrentGroup: (sessionStorage.getItem('currentGroup') || 'Global'),

    CurrentGroupPath: function (group) {
        if (group) return MSGPATH + group + '/';
        return MSGPATH + this.CurrentGroup + '/';
    },

    CurrentMSGPath: function () {
        return this.CurrentGroupPath() + 'msg/';
    },

    GetGroupOwner: function (group, callback) {
        GoogleFirebase.GetReference(this.CurrentGroupPath(group)).on('value', snap => {
            callback(GoogleFirebase.PathToEmail(snap.val().owner));
        });
    },

    CheckIfGroupExists: function (group, callback) {
        var ref = GoogleFirebase.GetReference(this.CurrentGroupPath(group));
        var listener = ref.on('value', snap => {
            ref.off('value', listener);
            var val = snap.val();
            callback(val != null);
        });
    },

    AcceptedEnter: function (group, callback) {
        this.CheckIfGroupExists(group, exists => {
            if (group == 'Global') {
                callback(true);
                return;
            }
            if (exists) {
                var ref = GoogleFirebase.GetReference(this.CurrentGroupPath(group) + 'users/' + GoogleFirebase.EmailToPath(
                    GoogleFirebase.CurrentUser.email));
                var listener = ref.on('value', snap => {
                    ref.off('value', listener);
                    var val = snap.val();
                    if (val === undefined || val === null) {
                        callback(undefined);
                    }
                    else if (val == true) {
                        callback(true);
                    }
                    else
                        callback(false);
                });
            }
            else {
                swal({
                    title: "Erro",
                    text: "Este grupo não existe.",
                    icon: "error",
                    dangerMode: true,
                });
                callback(false);
            }
        });
    },

    JoinGroup: function (group, callback) {
        this.CheckIfGroupExists(group, exists => {
            if (exists) {
                var email = GoogleFirebase.CurrentUser.email;
                if (!email || !GoogleFirebase.CurrentUser) {
                    swal({
                        title: "Erro",
                        text: "Você precisa estar logado para entrar em um grupo.",
                        icon: "error",
                        dangerMode: true,
                    });
                    callback(false);
                    return;
                }


                this.AcceptedEnter(group, joined => {

                    if (joined === undefined) {
                        GoogleFirebase.AddItem(this.CurrentGroupPath(group) + 'users/' + GoogleFirebase.EmailToPath(email),
                            group == 'Global' ? true : false
                            // O usuário já foi aprovado ? true : false
                            // Senão, deve ser aprovado pelo criador do grupo.
                        );

                        var globalGrp = group == 'Global';

                        if (!joined) {
                            fireStorage.getItem('groups', val => {
                                this.GetGroupOwner(group, owner => {
                                    if (!val) val = {};
                                    val[group] = owner;
                                    fireStorage.setItem('groups', val);
                                });
                            });
                        }
                        callback(true);
                    }
                    else if (joined) {
                        this.CurrentGroup = group;
                        if (typeof MessageManager !== 'undefined') {
                            MessageManager.ref = GoogleFirebase.GetReference(this.CurrentGroupPath());
                        }
                        sessionStorage.setItem('currentGroup', name);
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                });
            }
            else if (joined === false) {
                swal({
                    title: "Erro",
                    text: "Este grupo não existe.",
                    icon: "error",
                    dangerMode: true,
                });
                callback(false);
            }
        });
    },

    CreateGroup: function (group, callback) {
        this.CheckIfGroupExists(group, exists => {
            if (exists) {
                swal({
                    title: "Erro",
                    text: "Um grupo com este nome já existe.\nTente outro nome.",
                    icon: "error",
                    dangerMode: true,
                });
                callback(false);
            }
            else {
                var email = GoogleFirebase.CurrentUser.email;
                if (!email || !GoogleFirebase.CurrentUser) {
                    swal({
                        title: "Erro",
                        text: "Você precisa estar logado para criar um grupo.",
                        icon: "error",
                        dangerMode: true,
                    });
                    callback(false);
                    return;
                }
                var path = this.CurrentGroupPath(group);
                GoogleFirebase.AddItem(path, { owner: email });
                GoogleFirebase.AddItem(path + 'users/' + GoogleFirebase.EmailToPath(
                    GoogleFirebase.CurrentUser.email), true);
                fireStorage.getItem('groups', val => {
                    this.GetGroupOwner(group, owner => {
                        if (!val) val = {};
                        val[group] = owner;
                        fireStorage.setItem('groups', val);
                        callback(true);

                    });
                });
            }
        });
    },

    GetJoinedGroups: function (callback) {
        fireStorage.getItem('groups', val => { callback(val) });
    },

    GetMyGroups: function(callback)
    {
        let result = [];
        this.GetJoinedGroups(joinedGroups => {
            var keys = Object.keys(joinedGroups);
            len = keys.length;
            for (var i = 0; i < len; i ++)
            {
                var groupName = keys[i];
                var groupOwner = joinedGroups[groupName];
                if (groupOwner == GoogleFirebase.CurrentUser.email)
                    result.push(groupName);
            }
            callback(result);
        });
    },

    GetGroupUsers: function(group, callback)
    {
        console.log(`GroupManager.GetGroupUsers(${group}, ...)`);
        var ref = GoogleFirebase.GetReference(this.CurrentGroupPath(group) + 'users/');
        var listener = ref.on('value', snap => {
            var val = snap.val();
            ref.off('value', listener);
            callback(val);
        });
    },

    GetEnterRequests: function(callback)
    {
        let i;
        let j;
        let iTotal = -99;
        let jTotal = -99;

        let enterRequests = {};
        
        var interval = window.setInterval(() => {
            if (i == iTotal && j == jTotal)
            {
                window.clearInterval(interval);
                callback(enterRequests);
            }
        }, 512);

        this.GetMyGroups((myGroupArray) => {
            console.log('myGroups', myGroupArray);
            iTotal = myGroupArray.length;
            console.log('iTotal', iTotal);

            for (i = 0; i < iTotal; i ++)
            {
                let myGroup = myGroupArray[i];
                this.GetGroupUsers(myGroup, usersObject => {
                    console.log('users', usersObject);
                    var userNameArray = Object.keys(usersObject);
                    jTotal = userNameArray.length;

                    for (j = 0; j < jTotal; j ++)
                    {
                        var userName = userNameArray[j];        // console.log(userName == userEmail)
                        var userJoined = usersObject[userName]; // true
                        if (!userJoined)
                        {
                            enterRequests[myGroup] = new Array();
                            enterRequests[myGroup].push(userName);
                        }
                    }
                });
            }
        });
    },

    CheckEnterRequests: function()
    {
        this.GetEnterRequests(requests => {
            console.log(requests);
            let keys = Object.keys(requests);
            let len = keys.length;
            console.log(len);
            var idx = 0;
            var dialog = false;

            var interval = window.setInterval(() => {
                if (!dialog)
                {
                    if (idx >= len)
                    {
                        window.clearInterval(interval);
                        return;
                    }
                    dialog = true;
                    var group = keys[idx];
                    console.log(idx, group);
                    let users = requests[group];

                    var html = `<h5>Grupo: <b>${group}</b><h5><hr>`;

                    for (var i = 0; i < users.length; i ++)
                    {
                        var user = users[i];
                        var email = GoogleFirebase.PathToEmail(user);
                        var id = email+group;
                        while(id.includes(' '))
                            id = id.replace(' ', '_');
                        html += `<span id="${id}"<b>${email}</b>: <button class="btn btn-success" 
                        onclick="GoogleFirebase.AddItem(GroupManager.CurrentGroupPath('${group}') + 'users/${user}', true);document.getElementById('${id}').outerHTML = '';">
                        Aceitar</button>
                        <button class="btn btn-danger"
                        onclick="GoogleFirebase.AddItem(GroupManager.CurrentGroupPath('${group}') + 'users/${user}', null);document.getElementById('${id}').outerHTML = '';">Negar</button><br>`;
                    }

                    swal({
                        title: 'Querem entrar em seu grupo!',
                        text: `HTML`,
                    }).then(() => {
                        idx++;
                        dialog = false;
                    });

                    // buid swal html
                    document.querySelector('.swal-text').innerHTML = html;
                }
            }, 100);
        });
    }
};
