const VERSION = '1.9.6';

var AllResources = LocalResourceCache.GetResource('data/resources.json');

if(!AllResources)
fetch('data/resources.json').then(response => {
  response.text().then(txt => {
    AllResources = JSON.parse(txt);
  })
})

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
            buttons: ['Por que devo atualizar?', 'Ok'],
            icon: 'info'
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