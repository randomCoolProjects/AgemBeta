const VERSION = '1.9';

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