const LocalResourceCache =
{
    HTTPRequest: function(url, callback)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);

    },

    DownloadResource: function(resUrl, callback)
    {
        this.HTTPRequest(resUrl, resource => {
            localStorage.setItem(resUrl, resource);
            callback(resource);
        });
    },

    GetResource: function(url)
    {
        var resource = localStorage.getItem(url);
        return resource;
    },

    LoadResource: function(resUrl, resourceType)
    {
        if (!resourceType) resourceType = 'script';
        var resource = this.GetResource(resUrl);
        var element = document.createElement(resourceType);
        element.innerHTML = resource;
        var head = document.head;
        if (!head) head = document.getElementsByTagName('head')[0];
        head.appendChild(element);
    },

    LoadImage: function(url, callback)
    {
        var data = localStorage.getItem(url);
        if (!data || data.length <= 1) // An image size certain will be more than 1 char (base64)
        {
            ImageEncoder.ToDataURL(url, img64 => {
                localStorage.setItem(url, img64);
                data = img64;
                callback(data);
            });
        }
        else
        callback(data);
    }
}

if (!localStorage.getItem('total_files') && !location.href.endsWith('update.html'))
{
    alert('Você precisa atualizar o APP!\nClique OK para atualizar.');
    localStorage.clear();
    location.href = 'update.html';
}

function LoadHtml(url)
{
    var page = localStorage.getItem(url);

    if (!page)
        page = LocalResourceCache.GetResource('raw_pages/'+ url.substring(0, url.length - 5) + '_raw_page.html');
    
        document.write(page);
}

function CacheClear(warn = true)
{
    if (warn)
    if (!confirm('ATENÇÃO!\nLimpar o cache pode resolver alguns problemas, entretanto, irá restaurar as configurações padrão.'))return;
    localStorage.clear();
    location.href = 'update.html';
}