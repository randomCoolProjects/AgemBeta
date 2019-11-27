let SHARE_TEXT = '';
const share_element = document.querySelector('.share');
var elements = document.getElementsByClassName('share-btn');
for (var i = 0; i < elements.length; i++) {
    var shareBtn = elements[i];
    var svc = shareBtn.classList[1]; // 0 = 'share-btn', 1 = service (whats, face, ...)
    shareBtn.setAttribute('style', `background-image: url("./img/share/${svc}.png");`);
    eval(`var __api_${svc} = "${shareBtn.getAttribute('api')}";`);
    shareBtn.addEventListener('click', (e) => {
        if (!SHARE_TEXT || SHARE_TEXT.length <= 0) {
            if (typeof swal == 'undefined') var swal;
            (swal || alert)('Nada a compartilhar!', 'Nenhum texto!', 'error');
            return;
        }
        var api = eval(`__api_${e.target.classList[1]}`);
        if (api != 'copy') {
            var url = api.replace('TEXT', encodeURIComponent(SHARE_TEXT));
            window.open(url);
        }
        else {
            navigator.clipboard.writeText(SHARE_TEXT);
            if (typeof swal == 'undefined') var swal;
            (swal || alert)('Texto copiado!', 'Ok', 'success');
        }
        SHARE_TEXT = '';
       share_element.classList.add('hidden');
    });
}

share_element.addEventListener('click', () => share_element.classList.add('hidden'));