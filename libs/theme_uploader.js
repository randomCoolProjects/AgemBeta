function uploadTheme()
{
    var themeUrl = $('#inputUrl').val();
    var ThemeObj = LocalResourceCache.HTTPRequest(themeUrl + 'theme.json');
    if (!$('#inputThemeName').val() || ThemeObj == null || ThemeObj.length < 4)
    {
        swal({
            title: "Oops",
            text: "Tema inválido. Consulte a documentação.",
            icon: "error",
            dangerMode: true,
          });
        return;
    }

    ThemeObj = JSON.parse(ThemeObj);

    if (!ThemeObj['dev-email'] || !ThemeObj['dev-name'])
    {
        swal({
            title: "Oops",
            text: "Tema inválido. Consulte a documentação.",
            icon: "error",
            dangerMode: true,
          });
          return;
    }


    console.log(ThemeObj);

    var name = $('#inputThemeName').val();
    GoogleFirebase.AddItem(ROOT + '/themes/' + name, themeUrl);

    swal('A princípio, seu tema está no ar!');

}