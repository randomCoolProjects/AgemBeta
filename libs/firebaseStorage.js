const fireStorage = 
{

    isLoggedIn: function()
    {
        if (GoogleFirebase.CurrentUser && GoogleFirebase.CurrentUser.email)
            return true;
        return false;
    },

    setItem: function(item, value)
    {
        if (!this.isLoggedIn)
        {
            swal({
                title: "Erro",
                text: "Você não está logado.\nFaça log-in.",
                icon: "error",
                dangerMode: true,
            });
            return;
        }
        GoogleFirebase.AddItem(ROOT + 'usrdata/' +
            GoogleFirebase.EmailToPath(
                GoogleFirebase.CurrentUser.email
            ) + '/' + item,
            value
        )
    },

    getItem: function(item, callback)
    {
        var ref = GoogleFirebase.GetReference(ROOT + 'usrdata/' +
        GoogleFirebase.EmailToPath(
            GoogleFirebase.CurrentUser.email
        ) + '/' + item);

        var listener = ref.on('value', snap => {
            ref.off('value', listener);
            callback(snap.val());
        });
    },

    clear: function()
    {
        this.setItem('', null);
    }
};