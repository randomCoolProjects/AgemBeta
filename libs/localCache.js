const LocalResourceCache =
{
    HTTPRequest: function(url)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", url, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;

    },
    RequestResource: function(resUrl)
    {
        if (!resUrl) return null;
        var resource = localStorage.getItem(resUrl);
        if (resource && resource.length > 1) // Okay, file size certain will be more than 1 byte 
            return resource;
        resource = this.HTTPRequest(resUrl);
        localStorage.setItem(resUrl, resource);
        return resource;
    },
    LoadResource: function(resUrl, resourceType)
    {
        if (!resourceType) resourceType = 'script';
        var resource = this.RequestResource(resUrl);
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

function LoadHtml(url)
{
    var page = localStorage.getItem(url);
    if (!page)
    {
        page = LocalResourceCache.RequestResource('raw_pages/'+ url.substring(0, url.length - 5) + '_raw_page.html');
    }
    document.write(page);
}

function CacheClear(warn = true)
{
    if (warn)
    alert('ATENÇÃO!\nLimpar o cache pode resolver alguns problemas, entretanto, irá restaurar as configurações padrão.');
    localStorage.clear();
    location.reload();
}