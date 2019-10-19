var PageResources = 
{
    'index.html': {
        'libs/source_firebase.js': 'script',
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

        'libs/sensore.js': 'script',
        'libs/firebase.js': 'script',
        'libs/messageManager.js': 'script',
        'libs/emoji_database.js': 'script',
        'libs/updater.js': 'script',
        'libs/htmlFormatter.js': 'script',
        'libs/imageEncoder.js': 'script',
        'libs/index.js': 'script',
    },
    'login.html': {
        'libs/source_firebase.js': 'script',
        'main.css': 'style',
        'css/login.css': 'style',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css': 'style',
        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'libs/firebase.js': 'script',
        'libs/imageEncoder.js': 'script',
        'libs/login_page.js': 'script',
    },
    'register.html': {
        'libs/source_firebase.js': 'script',
        'main.css': 'style',
        'css/login.css': 'style',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css': 'style',
        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'libs/firebase.js': 'script',
        'libs/imageEncoder.js': 'script',
        'libs/register_page.js': 'script',
    },
    'marketplace.html': {
        'libs/source_firebase.js': 'script',
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

        'libs/firebase.js': 'script',
        'libs/themeLoader.js': 'script',
        'libs/marketplace.js': 'script'
    },
    'theme_upload.html': {
        'libs/source_firebase.js': 'script',
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

        'libs/firebase.js': 'script',
        'libs/theme_uploader.js': 'script',
    },

    'updates.html': {
        'libs/source_firebase.js': 'script',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'main.css': 'style',
        'css/menu.css': 'style',
        'css/index.css': 'style',

        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': 'script',
    },

    'theme_docs.html': {
        'libs/source_firebase.js': 'script',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'main.css': 'style',
        'css/menu.css': 'style',
        'css/index.css': 'style',

        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': 'script',
    }
}

{

var split = (String)(window.location).split('/');
var currPage = split[split.length-1];
var resources = PageResources[currPage.replace('#', '')];

var URLs = Object.keys(resources);
var types = Object.values(resources);

var Index = 0;

for (Index = 0; Index < URLs.length; Index++)
{
    LocalResourceCache.LoadResource(URLs[Index], types[Index]);
}

PageResources = null; // Unload for clearing out memory
delete PageResources;

}