var { app_id, app_hash, token_bot, phone_number, user_id_admins } = {
    "app_id": Number(process.env.app_id),
    "app_hash": String(process.env.app_hash),
    "token_bot": String(process.env.token_bot),
    "phone_number": Number(process.env.phone_number) ?? 628888888,
    "user_id_admins": [
        Number(process.env.user_id_admins)
    ]
};

var { telegram, telegramApi } = require("tdl-lib");
var telegrambot = new telegram(app_id, app_hash, `./client/${token_bot}`);
var telegramuser = new telegram(app_id, app_hash, `./client/${phone_number}`);
var tg = new telegramApi(telegrambot.client);
var tg_user = new telegramApi(telegramuser.client);
var timer = require("timers/promises");
var timers = require("timers");

var get_auth_state = ['authorizationStateWaitPhoneNumber', 'authorizationStateWaitCode', 'authorizationStateWaitPassword', 'authorizationStateReady'];
var set_auth_state = ['setAuthenticationPhoneNumber', 'checkAuthenticationCode', 'checkAuthenticationPassword'];
var type_auth_state = ['phone_number', 'code', 'password'];


function check_admin(array, index) {
    if (array.indexOf(index) > -1) {
        return true;
    } else {
        return true;
    }
}


function acces_data(data, check_user) {
    if (data.indexOf(check_user) > -1) {
        return true;
    } else {
        return false;
    }
}

var curAuthState = {};
var curAuthData = {};

telegrambot.client.on('error', function (err) {
    console.error('Got error:', JSON.stringify(err, null, 2));
})

telegrambot.client.on('destroy', function () {
    console.log('Destroy event');
})

telegrambot.on('update', async function (update) {
    try {
        if (update) {
            if (update["callback_query"]) {
                var cb = update.callback_query;
                var cbm = cb.message;
                try {
                    if (new RegExp("^login$", "i").exec(cb.data)) {
                        var isClientUserStart = await startClientUser(cb.from.id)
                        if (isClientUserStart) {
                            var data = {
                                "chat_id": cbm.chat.id,
                                "text": `Hay Perkenalkan saya bot tolong gunakan saya degan bijak yah`,

                            };
                            return await tg.request("sendMessage", data);
                        } else {
                            return await tg.sendMessage(cbm.chat.id, "Start Client UserBot Gagal!");
                        }
                    }
                } catch (e) {
                    var data = {
                        "chat_id": chat_id,
                        "text": e.message
                    };
                    return await tg.request("sendMessage", data);
                }

            }

            if (update.message) {
                var msg = update.message;
                var chat_id = msg.chat.id;
                var user_id = msg.from.id;
                var chat_type = msg.chat.type;
                var text = msg.text ?? "";
                var is_outgoing = msg.outgoing ?? false;
                try {
                    if (!is_outgoing) {

                        if (text) {

                            if (RegExp("^/jsondump$", "i").exec(text)) {
                                var data = {
                                    "chat_id": chat_id,
                                    "text": JSON.stringify(msg, null, 2)
                                };
                                return await tg.request("sendMessage", data);
                            }
                            if (RegExp("/ping", "i").exec(text)) {
                                var time = (Date.now() / 1000) - msg.date;
                                var data = {
                                    "chat_id": chat_id,
                                    "text": `Pong ${time.toFixed(3)}`
                                };
                                return await tg.request("sendMessage", data);
                            }

                            if (/^[!\.\/](settings|start)$/i.exec(msg.text) && RegExp("^private$", "i").exec(chat_type)) {
                                var message = "Hay Perkenalkan saya adalah crypto bot";
                                var data = {
                                    "chat_id": chat_id,
                                    "text": message,
                                    "reply_markup": {
                                        "inline_keyboard": [
                                            [
                                                {
                                                    "text": "️⚙️ LOGIN USERBOT ⚙️",
                                                    "callback_data": "login"
                                                }
                                            ],
                                            [
                                                {
                                                    "text": "️⚙️ INFOBOT ⚙️",
                                                    "callback_data": "informationbot"
                                                }
                                            ]
                                        ]
                                    }
                                }
                                return await tg.request("sendMessage", data)
                            }

                            if (/^(-.* )/i.exec(msg.text) && new RegExp("^private$", "i").exec(msg.chat.type)) {
                                if (acces_data(user_id_admins, user_id)) {
                                    var input = msg.text.split(" ");
                                    var ada = false;
                                    var param = {};
                                    if (input.length == 2) {
                                        for (var x in type_auth_state) {
                                            if ("-" + type_auth_state[x] == input[0]) {
                                                curAuthData[type_auth_state[x]] = input[1];
                                                param["_"] = set_auth_state[x];
                                                param[type_auth_state[x]] = curAuthData[type_auth_state[x]];
                                                ada = true;
                                                return sendAuthClientUser(param);
                                            }
                                        }
                                    }
                                    return await tg.sendMessage(chat_id, "ulangi lagi!");
                                } else {
                                    return await tg.sendMessage(chat_id, "Khusus admin ya!");
                                }
                            }

                        }
                    }
                } catch (e) {
                    var data = {
                        "chat_id": chat_id,
                        "text": e.message
                    };
                    return await tg.request("sendMessage", data);

                }
            }

        }

    } catch (e) {
        console.log(e);
    }
})


function sendAuthClientUser(param) {
    try {
        telegramuser.client.invoke(param).catch(e => {
            return false
        })
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}

telegramuser.client.on('error', function (err) {
    console.error('Got error:', JSON.stringify(err, null, 2))
})

telegramuser.client.on('destroy', function () {
    console.log('Destroy event')
})

var cur_user_id = "";

telegramuser.on('update', async function (update) {
    try {
        if (update) {
            if (RegExp("^updateMessageSendSucceeded$", "i").exec(update['_'])) {

            } else if (RegExp("^updateConnectionState$", "i").exec(update['_'])) {

            } else if (RegExp("^updateOption$", "i").exec(update['_'])) {

            } else if (RegExp("^updateAuthorizationState$", "i").exec(update['_'])) {

                if (check_admin(user_id_admins, cur_user_id)) {
                    if (RegExp(`^${get_auth_state[0]}$`, "i").exec(update.authorization_state['_'])) {
                        curAuthState[cur_user_id] = get_auth_state[0];
                        return await tg.sendMessage(cur_user_id, "Silakan ketik <b>Nomor Ponsel</b>\nformat <code>-phone_number " + phone_number + "</code>\nContoh <code>-phone_number 0123456789</code>", "HTML");
                    }

                    if (RegExp(`^${get_auth_state[1]}$`, "i").exec(update.authorization_state['_'])) {
                        curAuthState[cur_user_id] = get_auth_state[1];
                        return await tg.sendMessage(cur_user_id, "Silakan ketik <b>Auth Code</b>\nformat <code>-code NOMOR</code>\nContoh <code>-code 12345</code>", "HTML");
                    }

                    if (RegExp(`^${get_auth_state[2]}$`, "i").exec(update.authorization_state['_'])) {
                        curAuthState[cur_user_id] = get_auth_state[2];
                        return await tg.sendMessage(cur_user_id, "Silakan ketik <b>Password</b>\nformat <code>-password TEXT</code>\nContoh <code>-password qwerty123</code>", "HTML");
                    }

                    if (RegExp(`^${get_auth_state[3]}$`, "i").exec(update.authorization_state['_'])) {
                        curAuthState[cur_user_id] = get_auth_state[3];
                        var get_active = await tg_user.invoke("getActiveSessions");
                        var pesan = "📥 Event: " + get_active._;
                        for (var x in get_active.sessions) {
                            pesan += '\n\n🔑 Api_Id: ' + get_active.sessions[x].api_id;
                            pesan += '\n📱 Model: ' + get_active.sessions[x].device_model;
                            pesan += '\n📲 Device: ' + get_active.sessions[x].platform;
                            pesan += '\n🔧 System: ' + get_active.sessions[x].system_version;
                            pesan += '\n💻 Ip: ' + get_active.sessions[x].ip;
                            pesan += '\n🚪 Location: ' + get_active.sessions[x].country;
                        }
                        await tg.sendMessage(cur_user_id, pesan);
                        var getME = await tg_user.getMe();
                        var pesan = "📥 Event: " + getME._;
                        pesan += '\n\n👤 First Name: ' + getME.first_name;
                        if (getME.last_name) {
                            pesan += '\n👤 Last Name: ' + getME.last_name;
                        }
                        if (getME.username) {
                            pesan += '\n🔰 Username: @' + getME.username;
                        }
                        if (getME.phone_number) {
                            pesan += '\n☎️ Phone: ' + getME.phone_number;
                        }
                        pesan += "\n";
                        pesan += `\n- contact ${getME.is_contact}`;
                        pesan += `\n- mutual_contact ${getME.is_mutual_contact}`;
                        pesan += `\n- support ${getME.is_support}`;
                        await tg.sendMessage(cur_user_id, pesan);
                        var data = {
                            "chat_id": cur_user_id,
                            "text": "Menu bot"
                        };
                        return await tg.request("sendMessage", data);
                    }
                } else {
                    if (RegExp(`^(${get_auth_state[0]}|${get_auth_state[1]}${get_auth_state[2]}|${get_auth_state[3]})$`, "i").exec(update.authorization_state['_'])) {
                        return await tg.sendMessage(cur_user_id, 'Kamu tidak punya akses!');
                    }
                }
            }
        }
    } catch (e) {
        console.log(e.message);
        await tg.sendMessage(cur_user_id, e.message);
    }
})

async function startClientUser(user_id) {
    try {
        cur_user_id = user_id;
        var hasil = await telegramuser.user();
        return hasil;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function main() {
    telegrambot.bot(token_bot);
    return true;
}

main();
