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
        var resource = localStorage.getItem(resUrl);
        if (resource)
            return resource;
        resource = this.HTTPRequest(resUrl);
        localStorage.setItem(resUrl, resource);
        return resource;
    },
    LoadResource: function(resUrl, resourceType)
    {
        var resource = this.RequestResource(resUrl);
        var element = document.createElement(resourceType);
        element.innerHTML = resource;
        var head = document.head;
        if (!head) head = document.getElementsByTagName('head')[0];
        head.appendChild(element);
    }
}

function LoadHtml(url)
{
    var page = localStorage.getItem(url);
    if (!page)
        page = LocalResourceCache.RequestResource('raw_pages/'+ url.substring(0, url.length - 5) + '_raw_page.html');
    document.write(page);
}