function isIE() {
    ua = navigator.userAgent;
    /* MSIE used to detect old browsers and Trident used to newer ones*/
    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    
    return is_ie; 
    }
    /* Create an alert to show if the browser is IE or not */
    if (isIE()){
        alert("Seu navegador está desatualizado. Tente outro navegador.");
        window.location = "about:blank";
    }