var ROOT_URL = '';
var PageResources = 
{
    'index.html': {
        'libs/source_firebase.js': 'script',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': ['script', {async: true}],
        'css/main.css': 'style',
        'css/menu.css': 'style',
        'css/index.css': 'style',
        'css/elements/switch.css': 'style',
        'css/elements/emoji_keyb.css': 'style',
        'css/elements/tooltip.css': 'style',
        'css/elements/message.css': 'style',

        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': ['script', {async: true}],
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': ['script', {async: true}],
        'https://cdnjs.cloudflare.com/ajax/libs/push.js/1.0.5/push.js': ['script', {async: true}],

        'libs/fbconfig.js': 'script',
        'libs/environment.js': 'script',
        'libs/firebase.js': 'script',
        'libs/firebaseStorage.js': 'script',
        'libs/groupManager.js': 'script',
        'libs/messageManager.js': 'script',
        'libs/emoji_database.js': ['script', {async: true}],
        'libs/updater.js': ['script', {async: true}],
        'libs/htmlFormatter.js': 'script',
        'libs/imageEncoder.js': 'script',
        'libs/audioRecorder.js': 'script',
        'libs/serviceManager.js': 'script',
        'libs/index.js': 'script',
    },
    'groups.html': {
        'libs/source_firebase.js': 'script',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'css/main.css': 'style',
        'css/menu.css': 'style',
        'css/groups.css': 'style',

        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': 'script',

        'libs/fbconfig.js': 'script',
        'libs/environment.js': 'script',
        'libs/firebase.js': 'script',
        'libs/firebaseStorage.js': 'script',
        'libs/groupManager.js': 'script',
        'libs/imageEncoder.js': 'script',
        'libs/updater.js': 'script',
        'libs/groupsPage.js': 'script',
    },
    'login.html': {
        'libs/source_firebase.js': 'script',
        'css/main.css': 'style',
        'css/login.css': 'style',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': 'script',

        'libs/fbconfig.js': 'script',
        'libs/environment.js': 'script',
        'libs/firebase.js': 'script',
        'libs/imageEncoder.js': 'script',
        'libs/login_page.js': 'script',
    },
    'register.html': {
        'libs/source_firebase.js': 'script',
        'css/main.css': 'style',
        'css/login.css': 'style',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': 'script',

        'libs/fbconfig.js': 'script',
        'libs/environment.js': 'script',
        'libs/firebase.js': 'script',
        'libs/imageEncoder.js': 'script',
        'libs/register_page.js': 'script',
    },
    'marketplace.html': {
        'libs/source_firebase.js': 'script',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'css/main.css': 'style',
        'css/menu.css': 'style',
        'css/marketplace.css': 'style',
        'css/index.css': 'style',
        'css/elements/switch.css': 'style',
        'css/elements/tooltip.css': 'style',

        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': 'script',

        'libs/fbconfig.js': 'script',
        'libs/environment.js': 'script',
        'libs/firebase.js': 'script',
        'libs/themeLoader.js': 'script',
        'libs/marketplace.js': 'script'
    },
    'theme_upload.html': {
        'libs/source_firebase.js': 'script',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'css/main.css': 'style',
        'css/menu.css': 'style',
        'css/login.css': 'style',
        'css/marketplace.css': 'style',
        'css/index.css': 'style',
        'css/elements/switch.css': 'style',
        'css/elements/tooltip.css': 'style',

        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': 'script',

        'libs/fbconfig.js': 'script',
        'libs/environment.js': 'script',
        'libs/firebase.js': 'script',
        'libs/theme_uploader.js': 'script',
    },

    'updates.html': {
        'libs/source_firebase.js': 'script',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'css/main.css': 'style',
        'css/menu.css': 'style',
        'css/index.css': 'style',

        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': 'script',
    },

    'theme_docs.html': {
        'libs/source_firebase.js': 'script',
        'https://unpkg.com/sweetalert/dist/sweetalert.min.js': 'script',
        'css/main.css': 'style',
        'css/menu.css': 'style',
        'css/index.css': 'style',

        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js': 'script',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css': 'style',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js': 'script',
    }
}

{

var currPage = page_src;

var resources = PageResources[currPage.replace('#', '')];

var URLs = Object.keys(resources);
var types = Object.values(resources);

var Index = 0;

for (Index = 0; Index < URLs.length; Index++)
    LocalResourceCache.LoadResource(ROOT_URL + URLs[Index], types[Index]);

PageResources = null; // Unload for clearing out memory
delete PageResources;

}