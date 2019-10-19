GoogleFirebase.OnUserAuth = function()
{
    window.location = "index.html";
    /*window.setTimeout(function(){
        window.location = "index.html";
    }, 1000);*/
}
function register()
{
    var name = $("#inputName").val();
    var email = $("#inputEmail").val();
    var pass = $("#inputPassword").val();
    var repass = $("#repeatPassword").val();

    if (name.length < 4)
    {
        swal({
        title: "Erro",
        text: "Insira um nome válido!",
        icon: "error",
        dangerMode: true,
        });
        return;
    }
    if (email.length <= 4 || !email.includes('@') || !email.includes('.'))
    {
        swal({
        title: "Erro",
        text: "Email inválido.",
        icon: "error",
        dangerMode: true,
        });
        return;
    }
    if (pass != repass)
    {
        swal({
        title: "Erro",
        text: "As senhas não correspondem.",
        icon: "error",
        dangerMode: true,
        });
        return;
    }

    GoogleFirebase.Register
        (
         email,
         pass,
         name
         );

         window.setTimeout(function () {
        if (GoogleFirebase.Errored) {
            if (GoogleFirebase.Error.indexOf('auth/email-already-in-use') != -1)
            {
                swal({
                title: "Erro",
                text: "Já existe uma conta registrada com este email.",
                icon: "error",
                //buttons: true,
                dangerMode: true,
            })
                .then((ok) => {
                    location.reload();
                });
                return;
            }
            swal({
                title: "Erro",
                text: "Erro desconhecido: " + GoogleFirebase.Error,
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