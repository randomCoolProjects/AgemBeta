var ONLINE = true;
if (location.search == '?offline=true')
ONLINE=false;

if (!ONLINE)
{
    try
    {
    window.setInterval(() => {
        fetch('/data/check.txt') // check if online
        .then(res => {
            if (res.status == 200)
                location.href = location.href.replace('?offline=true', '');
        })
        .catch(err => {
            // NOTHING
        });
    }, 1250);
    }
    catch
    {
    }
}

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
            if (localStorage.getItem(resUrl) == resource)
            callback(resource);
        });
    },

    GetResource: function(url)
    {
        var resource = localStorage.getItem(url);
        return resource;
    },

    LoadResource: function(resUrl, resType)
    {
        var isArray = false;
        var resourceType = resType;
        if (resourceType != null && resourceType[0].length != 1)
        {
            resourceType = resType[0];
            isArray = true;
        }

        if (!resourceType) resourceType = 'script';
        var resource = this.GetResource(resUrl);
        if (!resource) return;
        var element = document.createElement(resourceType);
        element.innerHTML = resource;
        if (isArray)
        {
            for (var i = 1; i < resType.length; i ++)
            {
                if (i == resType.length) break;
                var attr = resType[i];
                console.log(attr);
                var keys = Object.keys(attr);
                element.setAttribute(keys[0], attr[keys[0]]);
            }
        }
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
    },

    LoadImageToElement: function(imgUrl, querySelector)
    {
        var imgE = document.querySelector(querySelector);
        this.LoadImage(imgUrl, img => {
                imgE.setAttribute('src', img);
        });
    }
}

if (ONLINE && !localStorage.getItem('total_files') && !location.href.replace('?offline=true', '').endsWith('update.html'))
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
    if (!ONLINE)
    {
        if (!swal)var swal;
        (swal || alert)('Você só pode fazer log-out quando conectado à internet!', 
        'Sem conexão', 'error');
        return;
    }

    if (warn)
    if (!confirm('ATENÇÃO!\nLimpar o cache pode resolver alguns problemas, entretanto, irá restaurar as configurações padrão.'))return;
    localStorage.clear();
    location.href = 'update.html';
}

var page_src = location.pathname;

if (page_src == '/') page_src = 'index.html';
if (page_src[0] == '/') page_src = page_src.substring(1);
console.log(page_src);
LocalResourceCache.LoadResource('libs/pageLoader.js');
LoadHtml(page_src);
