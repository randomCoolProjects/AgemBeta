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
        GoogleFirebase.AddItem(CacheParser.ProcessPath(Sys.Parse('%USRDATA%')) + item, value);
    },

    getItem: function(item, callback)
    {
        GoogleFirebase.GetValueOnce(CacheParser.ProcessPath(Sys.Parse('%USRDATA%')) + item, callback);
    },

    clear: function()
    {
        this.setItem('', null);
    }
};