function create_roomjson() {
    var data = {
        "server": $('#login-server').val(),
        "user": $('#login-user').val(),
        "userpassword": $('#login-userpass').val(),
        "room": $('#login-room').val(),
        "roompsk": $('#login-roompsk').val()
    };

    return JSON.stringify(data);
}

function create_sharekey(key) {
    return btoa(encodeURIComponent(key));
}

function create_share() {
    var json = create_roomjson();
    var key = create_sharekey(json);

    $('#sharekey').val(key);
}

function reset_sharekey() {
    $('#sharekey').val('');
}

function apply_sharejson(json) {
    var data = JSON.parse(json);

    $('#login-server').val(data.server)
    $('#login-user').val(data.user)
    $('#login-userpass').val(data.userpassword)
    $('#login-room').val(data.room)
    $('#login-roompsk').val(data.roompsk)
}

function parse_sharekey(key) {
    return decodeURIComponent(atob(key));
}

function apply_share() {
    var key = $('#sharekey').val();
    var json = parse_sharekey(key);
    apply_sharejson(json);
}

function download_sync(url, method) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, false);
    xhr.send(null);

    if (xhr.status === 200)
        return xhr.responseText;
    else
        return false;
}

function checkform() {
    if ($('#login-server').val() === '' ||
        $('#login-user').val() === '' ||
        $('#login-userpass').val() === '' ||
        $('#login-room').val() === '' ||
        $('#login-roompsk').val() === '')
        return false;
    else return true;
}

function checklogin(url, userstr, checkstr, password) {
    var data = download_sync(url + '?user=' + userstr, 'GET');
    try {
        var check = sjcl.decrypt(password, data)
        return check == checkstr;
    }
    catch {
        return false;
    }
}

function checkjoin(url, roomstr, checkstr, psk) {
    var data = download_sync(url + '?room=' + roomstr, 'GET');
    try {
        var check = sjcl.decrypt(psk, data);
        return check == checkstr;
    }
    catch {
        return false;
    }
}

var SHARED_serverbaseurl;

function login(scheme = 'https') {
    if (!checkform())
        return;

    var serverbaseurl = scheme + '://' + $('#login-server').val();
    SHARED_serverbaseurl = serverbaseurl;

    var serverdata = download_sync(serverbaseurl + '/serverinfo.php', 'GET');
    if (serverdata === null) {
        alert("No Server");
        return;
    }

    add_message('Client', 'Connected to server');
    serverdata = JSON.parse(serverdata);

    if (serverdata.servername === undefined) {
        alert("No Server");
        return;
    }

    add_message('Client', 'Connected to ' + serverdata.servername);

    if (!checklogin(serverbaseurl + '/tryuser.php', $('#login-user').val(), serverdata.checkstring, $('#login-userpass').val())) {
        alert("Login failed");
        return;
    }

    add_message('Server', 'Password Passed');

    if (!checkjoin(serverbaseurl + '/tryroom.php', $('#login-room').val(), serverdata.checkstring, $('#login-roompsk').val())) {
        alert("Join failed");
        return;
    }

    add_message('Server', 'Room Joined');

    add_message('Server', serverdata.servergreeting);

    $('#login').hide();
    $('#chatwindow').show();

    SHARED_updatetimer = setInterval(check_newmessage, 1000);
}

var SHARED_updatetimer;

var SHARED_lastmsgid = 0;

function stop_client(reason) {
    clearInterval(SHARED_updatetimer);
    $('#chat-controlbar').hide();
    add_message("Client", reason);
    console.error(reason);
    alert(reason);
}

function check_newmessage() {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 800;
    xhr.open("GET", SHARED_serverbaseurl + `/get.php?room=${$('#login-room').val()}&from=${SHARED_lastmsgid}`, true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                handle_newmessage(xhr.responseText);
            } else {
                stop_client(`Connection Error (${xhr.statusText})`);
            }
        }
    };
    xhr.onerror = function (e) {
        stop_client(`Connection Error (${xhr.statusText})`);
    };
    xhr.send(null);
}

function handle_newmessage(data) {
    try {
        var d = JSON.parse(data);
    }
    catch (e) {
        stop_client('FATAL: UNKNOWN Server Message. Tell Administrator "Delete All Message".');
        return;
    }

    if (d.length < 1) return;
    SHARED_lastmsgid = d[d.length - 1].id;

    for (var i = 0; i < d.length; i++) {
        var m = d[i];

        try {
            var pure = sjcl.decrypt($('#login-roompsk').val(), atob(m.message));
        }
        catch (e) {
            add_message(`Unknown (Server says ${m.user})`, `Message couldn't decrypt. (Error: ${e})`);
            continue;
        }

        add_message(m.user, pure);
    }
}

function request_sendmessage(url, room, user, message, psk) {
    var enc = sjcl.encrypt(psk, message);
    var msg = btoa(enc);
    var xhr = new XMLHttpRequest();

    xhr.open('POST', url);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhr.send(`room=${room}&user=${user}&msg=${msg}`);
}

function send_message() {
    request_sendmessage(SHARED_serverbaseurl + '/send.php', $('#login-room').val(), $('#login-user').val(), $('#chat-sendmsg').val(), $('#login-roompsk').val());
    $('#chat-sendmsg').val('');
}

function add_message(from, message) {
    var parent = document.getElementById('chat-messages')
    var item = document.createElement('p');
    item.innerText = from + ': ' + message
    parent.appendChild(item);
}

function handle_inkey() {
    if (window.event.keyCode == 13) send_message();
}