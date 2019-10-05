function InstallTheme(theme)
{
    var keys = Object.keys(theme);
    var values = Object.values(theme);

    var devEmail, devName;

    //check
    for (var i = 0; i < keys.length; i ++)
    {
        var key = keys[i];
        var value = values[i];
        console.log(key, value);
        if (key == 'dev-name')
        {
            devName = value;
            continue;
        }
        if (key == 'dev-email')
        {
            devEmail = value;
            continue;
        }

        if (key.substring(key.length-4,key.length).toLowerCase() != '.css') // not a style
        {
            swal({
                title: "Oops",
                text: "Ocorreu um problema ao carregar o tema",
                icon: "error",
                dangerMode: true,
              })
            return;
        }
    }

    //install
    for (var i = 0; i < keys.length; i ++)
    {
        var key = keys[i];
        var value = values[i];
        if (key == 'dev-name' || key == 'dev-email') continue;
        var css = LocalResourceCache.HTTPRequest(value);
        localStorage.setItem(key, css);
    }
}

var themeName;
function LoadTheme(themeUrl)
{
    var ThemeObj = (LocalResourceCache.HTTPRequest(themeUrl + 'theme.json'));
    ThemeObj = (Object)(JSON.parse(ThemeObj));

    console.log(ThemeObj);

    InstallTheme(ThemeObj);

}