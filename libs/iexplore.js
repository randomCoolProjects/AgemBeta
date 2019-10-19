function isIE() {
    ua = navigator.userAgent;
    /* MSIE used to detect old browsers and Trident used to newer ones*/
    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    
    return is_ie; 
}
    /* Create an alert to show if the browser is IE or not */
    if (isIE()){
        alert("Seu navegador está desatualizado. Use algum navegador que suporte HTML5. Recomendamos o Google Chrome ou Mozila Firefox");
        window.location = "about:blank";
}