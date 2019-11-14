const ROOT = '/beta/';
const MSGPATH = ROOT + 'msg/';
const BANPATH = ROOT + 'banned/'

// Initialize Firebase
var GoogleFirebase;

class AppFirebase {
    costructor() {
        this.CurrentUser = null;
        this._userReg = false;
        this.tmpName = "";
        this.Errored = false;
        this.Error = '';
    }

    Begin() {
        var config = {
            apiKey: "AIzaSyAlsBN7Pm_8tRSS4MfSV7ptRsHkAJ-zlM8",
            authDomain: "online-mega-chat.firebaseapp.com",
            databaseURL: "https://online-mega-chat.firebaseio.com",
            projectId: "online-mega-chat",
            storageBucket: "online-mega-chat.appspot.com",
            messagingSenderId: "829867333718"
        };
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                if (this._userReg == true) {
                    firebaseUser.updateProfile({
                        displayName: this.tmpName
                    }).then(function() {
                        // Update successful.
                        GoogleFirebase.CurrentUser = firebaseUser;
                        if (GoogleFirebase.OnUserAuth)
                            GoogleFirebase.OnUserAuth();
                    }, function(error) {
                        console.log(error);
                        // An error happened.
                    });
                    this._userReg = false;
                    return;
                }
                this.CurrentUser = firebaseUser;
                if (this.OnUserAuth)
                    this.OnUserAuth();
            }
        });
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

        firebase.auth().signOut().then(function () {
            localStorage.setItem('currentGroup', 'Global');
            // Sign-out successful.
        }).catch(function (error) {
            console.log("Error: ", error.message);
            GoogleFirebase.Errored = true;
        });
    }

    AddItem(path, obj) {
        var ref = firebase.database().ref(path);
        ref.push();
        ref.set(obj);
        ref.push();
    }

    AddFromRef(ref, obj) {
        ref.push();
        ref.set(obj);
        ref.push();
    }

    GetReference(path)
    {
        return firebase.database().ref().child(path);
    }

    GetValueOnce(path, callback)
    {
        var ref = this.GetReference(path);
        var listener = ref.on('value', snap => {
            ref.off('value', listener);
            callback(snap.val());
        });
    }

    OrderByKey(path)
    {
        this.GetReference(path).orderByKey();
    }

    EmailToPath(email)
    {
        var userEmail = email;
        while(userEmail.includes('@')) userEmail=userEmail.replace('@', '%');
        while(userEmail.includes('.')) userEmail=userEmail.replace('.', ' ');
        return userEmail;
    }

    PathToEmail(email)
    {
        var userEmail = email;
        while(userEmail.includes('%')) userEmail=userEmail.replace('%', '@');
        while(userEmail.includes(' ')) userEmail=userEmail.replace(' ', '.');
        return userEmail;
    }
}

const FileStorage =
{
    GetReference: function(path)
    {
        return firebase.storage().ref(ROOT + path);
    },

    UploadFile: function(path, file, callback)
    {
        this.GetReference(path).put(file, {contentType: file.type}).then(snap => {
            if(callback) callback(snap);
        });
    }
}

GoogleFirebase = new AppFirebase();
GoogleFirebase.Begin();
