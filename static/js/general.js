
var preloader = document.getElementById("loading");
function onLoaded() {
    preloader.style.display = "none";
}

function openNav() {
    document.getElementById("myNav").style.width = "300px";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function subscribes() {
    const $result = $("#email_result");
    var sub_email = $("#sub_email").val();
    const $alert_box = $("#alert-box");
    $result.text("");
    if (sub_email === "")
    {
        $alert_box.css("visibility", "visible");
        $result.text("Please specify a valid e-mail");
        setTimeout(function () {
            $alert_box.css("visibility", "hidden");
        }, 15000);
    }
    else if (validateEmail(sub_email)) {
        $alert_box.css("visibility", "hidden");
        return true;
    } else {
        $alert_box.css("visibility", "visible");
        $result.text(sub_email + " is not valid email");
        setTimeout(function () {
            $alert_box.css("visibility", "hidden");
        }, 15000);
        return false;
    }
}
