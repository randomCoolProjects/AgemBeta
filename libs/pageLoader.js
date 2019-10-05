const PageResources = 
{
    'index.html': {
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'main.css': 'style',
        'css/menu.css': 'style',
        'css/index.css': 'style',
        'css/elements/switch.css': 'style',
        'css/elements/emoji_keyb.css': 'style',
        'css/elements/tooltip.css': 'style',

        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': 'script',
        'libs/iexplore.js': 'script',

        'libs/sensore.js': 'script',
        'libs/firebase.js': 'script',
        'libs/messageManager.js': 'script',
        'libs/emoji_database.js': 'script',
        'libs/index.js': 'script'
    },
    'login.html': {
        'libs/iexplore.js': 'script',
        'main.css': 'style',
        'css/login.css': 'style',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css': 'style',
        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'libs/firebase.js': 'script'
    },
    'register.html': {
        'libs/iexplore.js': 'script',
        'main.css': 'style',
        'css/login.css': 'style',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css': 'style',
        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'libs/firebase.js': 'script'
    },
    'marketplace.html': {
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'main.css': 'style',
        'css/menu.css': 'style',
        'css/marketplace.css': 'style',
        'css/index.css': 'style',
        'css/elements/switch.css': 'style',
        'css/elements/tooltip.css': 'style',

        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': 'script',
        'libs/iexplore.js': 'script',

        'libs/firebase.js': 'script',
        'libs/themeLoader.js': 'script',
        'libs/marketplace.js': 'script'
    },
    'theme_upload.html': {
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'main.css': 'style',
        'css/menu.css': 'style',
        'css/login.css': 'style',
        'css/marketplace.css': 'style',
        'css/index.css': 'style',
        'css/elements/switch.css': 'style',
        'css/elements/tooltip.css': 'style',

        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': 'script',
        'libs/iexplore.js': 'script',

        'libs/firebase.js': 'script',
        'libs/theme_uploader.js': 'script',
    }
}

var split = (String)(window.location).split('/');
var currPage = split[split.length-1];
var resources = PageResources[currPage]

var URLs = Object.keys(resources);
var types = Object.values(resources);

var Index = 0;

for (Index = 0; Index < URLs.length; Index++)
{
    LocalResourceCache.LoadResource(URLs[Index], types[Index]);
}

// URLs.forEach((value, index) => {
//     LocalResourceCache.LoadResource(value, types[index]);
// });