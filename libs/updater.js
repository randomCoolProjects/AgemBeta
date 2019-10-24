const VERSION = '1.9.1';

var AllResources =
[
    //scripts:
    'libs/admin.js',
    'libs/emoji_database.js',
    'libs/firebase.js',
    'libs/htmlFormatter.js',
    'libs/iexplore.js',
    'libs/imageEncoder.js',
    'libs/index.js',
    'libs/localCache.js',
    'libs/login_page.js',
    'libs/marketplace.js',
    'libs/messageManager.js',
    'libs/pageLoader.js',
    'libs/register_page.js',
    'libs/sensore.js',
    'libs/source_firebase.js',
    'libs/theme_uploader.js',
    'libs/themeLoader.js',
    'libs/updater.js',

    //css
    'main.css',
    'css/index.css',
    'css/login.css',
	'css/marketplace.css',
	'css/menu.css',
    
    //css/elements
    'css/elements/emoji_keyb.css',
    'css/elements/switch.css',
    'css/elements/tooltip.css',

    //HTML Pages
    'raw_pages/index_raw_page.html',
    'raw_pages/login_raw_page.html',
    'raw_pages/marketplace_raw_page.html',
    'raw_pages/register_raw_page.html',
    'raw_pages/theme_docs_raw_page.html',
    'raw_pages/theme_upload_raw_page.html',
	'raw_pages/updates_raw_page.html',

	//audio
	'audio/notf.base64',
	'audio/sent.base64',

	//third party
	'https://unpkg.com/sweetalert/dist/sweetalert.min.js',
	'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
	'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
	'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'

];

function DownloadLastUpdate(callback)
{
	for (var i = 0; i < AllResources.length; i++)
	{
		var resUrl = AllResources[i];
		LocalResourceCache.DownloadResource(resUrl, resource => {
			callback(i, AllResources.length);
		});
	}
}

function CheckForUpdates()
{
    var ref = GoogleFirebase.GetReference(ROOT + 'currVersion/');
    ref.on('value', snap => {
        var updatedVersion = snap.val();
        console.log('Current version:', updatedVersion);
        if (updatedVersion != VERSION)
        {
        swal({
            title: 'Nova atualização',
            text: 'Chegou uma nova atualização.\nClique em "Ok" para atualizar o app.\nVersão atual: ' + VERSION + '\nNova versão: ' + updatedVersion,
            dangerMode: false,
            buttons: ['Por que devo atualizar?', 'Ok']
          })
            .then((val) => {
              if (val)
              {
                localStorage.clear();
                location.reload();
              }
            else
            {
            	location.href = 'updates.html';
            }
            });
        }
    });
}