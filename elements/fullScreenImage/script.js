function showImage(url)
{
    const imgFs = document.querySelector('.img-fullscreen');
    const imgRaw = imgFs.firstElementChild;

    imgRaw.setAttribute('style', `background-image: url('${url}');`);
    //imgRaw.setAttribute('src', url);
    imgFs.classList.remove('hidden');
}

function CloseFSImage()
{
    const imgFs = document.querySelector('.img-fullscreen');
    imgFs.classList.add('hidden');
}