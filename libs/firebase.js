const ROOT = 'beta/';
const MSGPATH = ROOT + 'msg/';
const BANPATH = ROOT + 'banned/'

let DEBUG = console.log;
if (ROOT != 'beta/')
    DEBUG = function () { };

// Initialize Firebase
var GoogleFirebase;

const CacheParser = {

    reads: {},
    sec_ct: 0,
    null_why: '',

    RemoveItem: function (path) {
        path = this.ProcessPath(path);
        var children = this.GetChildren(path);
        localStorage.removeItem('fbcache/' + path);
        if (children)
            children.forEach(child => {
                localStorage.removeItem('fbcache/' + child);
            });
    },

    GetItemRaw: function (path) {
        return localStorage.getItem('fbcache/' + this.ProcessPath(path));
    },

    GetChildren: function (path) {
        if (!localStorage) return null;
        var keys = Object.keys(localStorage);
        path = 'fbcache/' + this.ProcessPath(path);
        var len = path.length;

        var child = null;

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key.substring(0, len) != path) continue;
            if (child == null) child = new Array();
            child.push(key.substring('fbcache/'.length));
        }

        return child;

    },

    ProcessPath: function (path) {
        if (path == null) return path;
        if (path[0] == '/') path = path.substring(1);
        if (path[path.length - 1] != '/') path += '/';
        return path;
    },

    Match: function (cache, path) {
        var keys = Object.keys(cache);
        var matched = null;
        path = this.ProcessPath(path);
        var pbkp = path;
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            path = pbkp;
            var cachePath = key;
            cachePath = Sys.Parse(key);

            cachePath = this.ProcessPath(cachePath);

            if (path == cachePath && !cache[key].childMask) {
                matched = key;
                continue;
            }

            if (cache[key].childMask) {
                var noMatch = false;
                var split = path.split('/');
                path = '';
                var len = split.length - cache[key].childMask.length - 1;
                mlp:
                for (var j = 0; j < len; j++) {
                    if (j == len) break mlp;
                    path += split[j] + '/';
                }
                if (path != cachePath) continue;
                for (var j = len; j < split.length - 1; j++) {
                    var pathKey = split[j];
                    var mask = new RegExp(cache[key].childMask[j - len]);
                    if (!mask.test(pathKey)) {
                        noMatch = true;
                    }
                }
                if (!noMatch) matched = key;
            }
        }
        return matched;
    },

    Save: function (cache, path, value) {
        if (value == null)
            return;
        path = this.ProcessPath(path);
        var key = this.Match(cache, path);
        if (!key) {
            var vKeys = Object.keys(value);
            if (vKeys[0] == '0' && vKeys.length == 1) return;
            for (var i = 0; i < vKeys.length; i++) {
                var vKey = vKeys[i];
                this.Save(cache, path + vKey, value[vKey]);
            }
            return;
        }

        var strVal = JSON.stringify(value);
        localStorage.setItem('fbcache/' + path, strVal);

    },

    Load: function (cache, path) {
        this.null_why = '';
        path = this.ProcessPath(path);
        var key = this.Match(cache, path);
        if (!key) {
            var subKeys = this.GetChildren(path);
            if (subKeys) {
                var obj = {};
                for (var i = 0; i < subKeys.length; i++) {
                    var subPath = subKeys[i];
                    var item = this.Load(cache, subPath);
                    if (item == null && this.null_why == 'off_only') return null;
                    if (item == null) continue;
                    var dif = subPath.substring(path.length);
                    if (dif[dif.length - 1] == '/') dif = dif.substring(0, dif.length - 1);
                    obj[dif] = item;
                }
                if (obj.length == 0) return null;
                return obj;
            }
            return null;
        }
        var opt = cache[key];
        if (opt.readTimes == "OFFLINE" && ONLINE) {
            this.null_why = 'off_only';
        }
        if (opt.readTimes != undefined) {
            if (this.reads[key] == undefined)
                this.reads[key] = opt.readTimes;
            if (this.reads[key] == 0) return null;
            this.reads[key]--;
        }
        var value = localStorage.getItem('fbcache/' + path);
        try {
            return JSON.parse(value);
        }
        catch
        {
            return value;
        }

    }
}

class AppFirebase {
    costructor() {
        this.CurrentUser = null;
        this._userReg = false;
        this.tmpName = "";
        this.Errored = false;
        this.Error = '';
        this.Cache = null;
    }

    Begin() {
        if (ONLINE)
        {
            DEBUG('init');
            firebase.initializeApp(config);
        }
        else
        DEBUG('No init coz no online');

        let sessionUser = JSON.parse(sessionStorage.getItem('fbuser'));
        if (sessionUser) {
            this.CurrentUser = sessionUser;
            if (this.OnUserAuth) this.OnUserAuth();
            else {
                let ct = 0;
                var int = window.setInterval(() => {
                    if (ct > 50) window.clearInterval(int);
                    if (this.OnUserAuth) {
                        this.OnUserAuth();
                        window.clearInterval(int);
                    }
                    ct++;
                }, 100);
            }
        }

        if (ONLINE) {
            firebase.auth().onAuthStateChanged(firebaseUser => {
                if (firebaseUser) {
                    if (this._userReg == true) {
                        firebaseUser.updateProfile({
                            displayName: this.tmpName
                        }).then(function () {
                            // Update successful.
                            GoogleFirebase.CurrentUser = firebaseUser;
                            if (GoogleFirebase.OnUserAuth)
                                GoogleFirebase.OnUserAuth();
                        }, function (error) {
                            console.log(error);
                            // An error happened.
                        });
                        this._userReg = false;
                        return;
                    }
                    this.CurrentUser = firebaseUser;
                    if (this.OnUserAuth) {
                        sessionStorage.setItem('fbuser', JSON.stringify(firebaseUser));
                        if (!sessionUser)
                        this.OnUserAuth();
                    }
                }
            });
        }
    }

    Login(email, password) {
        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                GoogleFirebase.Error = errorCode;
                console.log(errorCode, errorMessage);
                GoogleFirebase.Errored = true;
                // ...
            });
    }

    Register(email, password, name) {
        this._userReg = true;
        this.tmpName = name;

        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
                GoogleFirebase.Error = errorCode;
                GoogleFirebase.Errored = true;
                // ...
            });
    }

    Logout() {

        if (!ONLINE) {
            if (!swal)var swal;
            (swal || alert)('Você só pode fazer log-out quando conectado à internet!',
                'Sem conexão', 'error');
            return;
        }

        firebase.auth().signOut().then(function () {
            sessionStorage.clear();
            // Sign-out successful.
        }).catch(function (error) {
            console.log("Error: ", error.message);
            GoogleFirebase.Errored = true;
        });
    }

    AddItem(path, obj) {
        if (ONLINE) {
            var ref = firebase.database().ref(path);
            ref.push();
            ref.set(obj);
            ref.push();
            CacheParser.Save(this.Cache, path, obj);
        }
    }

    AddFromRef(ref, obj) {
        if (ONLINE) {
            try {
                var path = '';
                ref.path.pieces.forEach(piece => {
                    path += piece + '/';
                });
                ref.push();
                ref.set(obj);
                ref.push();
                CacheParser.Save(this.Cache, path, obj);
            }
            catch{ }
        }
    }

    GetReference(path) {
        if (ONLINE) {
            try {
                return firebase.database().ref().child(path);
            }
            catch{ }
        }
    }

    GetValueOnce(path, callback) {
        var cache = CacheParser.Load(this.Cache, path);
        if (cache) {
            callback(cache);
            return;
        }
        if (ONLINE) {
            try {
                var ref = this.GetReference(path);
                var listener = ref.on('value', snap => {
                    var val = snap.val();
                    ref.off('value', listener);
                    if (val == null)
                        CacheParser.RemoveItem(path);
                    else
                        CacheParser.Save(this.Cache, path, val);
                    callback(val);
                });
            }
            catch{ }
        }
    }

    OrderByKey(path) {
        if (ONLINE) {
            try {
                this.GetReference(path).orderByKey();
            }
            catch{ }
        }
    }

    EmailToPath(email) {
        var userEmail = email;
        while (userEmail.includes('@')) userEmail = userEmail.replace('@', '%');
        while (userEmail.includes('.')) userEmail = userEmail.replace('.', ' ');
        return userEmail;
    }

    PathToEmail(email) {
        var userEmail = email;
        while (userEmail.includes('%')) userEmail = userEmail.replace('%', '@');
        while (userEmail.includes(' ')) userEmail = userEmail.replace(' ', '.');
        return userEmail;
    }
}

const FileStorage =
{
    GetReference: function (path) {
        return firebase.storage().ref(ROOT + path);
    },

    UploadFile: function (path, file, callback, meta) {
        this.GetReference(path).put(file, meta || { contentType: file.type }).then(snap => {
            if (callback) callback(snap);
        });
    }
}

GoogleFirebase = new AppFirebase();
GoogleFirebase.Cache = JSON.parse(LocalResourceCache.GetResource('data/cache.json'));
GoogleFirebase.Begin();

if (ONLINE && !location.href.includes('login.html') && !location.href.includes('register.html')) {

    const messaging = firebase.messaging();
    const FBNotification = {

        RequestPermission: function () {
            messaging.requestPermission().then(() => {
                return messaging.getToken();
            }).then((token) => {
                fireStorage.setItem('notfToken', token);
                DEBUG(token);
            });
        },

        Init: function () {
            navigator.serviceWorker.register('./firebase-messaging-sw.js')
            .then((registration) => {
            messaging.useServiceWorker(registration);

                this.RequestPermission();

            });
            messaging.onMessage = this.OnMessage;
        },

        OnMessage: function (payload) {
            Push.create('test');
        }
    }

    window.setTimeout(() => FBNotification.Init(), 200);

}