GoogleFirebase.OnUserAuth = function () {
    window.location = "index.html";
}
function login() {
    GoogleFirebase.Login(
        $("#inputEmail").val(),
        $("#inputPassword").val());
    window.setTimeout(function () {
        if (GoogleFirebase.Errored) {
            swal({
                title: "Erro",
                text: "Ocorreu um erro ao logar-se. Talvez essa conta seja inexistente.",
                icon: "error",
                //buttons: true,
                dangerMode: true,
            })
                .then((ok) => {
                    location.reload();
                });
        }
    }, 1000);
}