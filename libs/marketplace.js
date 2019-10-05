var themesElement;

function AddThemeElement(id, name, url)
{
    var html =  `<div id="${id}" class="theme" theme-url="${url}">
    <img src="${url}icon.png" align="middle">
    <span>${name}</span>
    <button onclick="themeName='${name}';LoadTheme('${url}');">Instalar</button>
</div>`;
    var themeElement = document.createElement('div');
    themesElement.appendChild(themeElement);

    themeElement.outerHTML = html;
}

document.addEventListener("DOMContentLoaded", function (event) {
    window.setTimeout(() => {
        themesElement = document.querySelector('.themes');
    var ref = GoogleFirebase.GetReference(ROOT + '/themes');
    ref.on('value', snap => {
        var themes = snap.val();
        var keys = Object.keys(themes);
        for (var i = 0; i < keys.length; i ++)
        {
            var key = keys[i];       //theme name
            var value = themes[key]; //theme url
            AddThemeElement('t' + i, key, value);
        }
    });
}, 100);
});