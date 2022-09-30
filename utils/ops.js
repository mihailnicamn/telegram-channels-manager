const db = require('./db');

const ops = {
    admin: {
        set(id, name, username) {
            db.read('data.json')
                .then(data => {
                    data = JSON.parse(data);
                    if (id && data.admin.id == 0) data.admin.id = id;
                    if (name && data.admin.id == id) data.admin.name = name;
                    if (username && data.admin.id == id) data.admin.username = username;
                    db.write('data.json', JSON.stringify(data));
                })
        },
        async is(ctx, ops_cb, command, argument_name, argument_value) {
            db.read('data.json')
                .then(async data => {
                    data = JSON.parse(data);
                    if (data.admin.id.toString() == parseInt(0).toString()) {
                        ops_cb.admin.set(ctx.from.id, ctx.from.first_name, ctx.from.username);
                        ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.start_new, { admin_name: ctx.from.first_name, bot_name: data.bot.name }), { parse_mode: 'HTML' });
                    } else {
                        if (data.admin.id == ctx.from.id) {
                            //------------------START------------------//
                            if (command == "start") {
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.start_again, { admin_name: ctx.from.first_name }), { parse_mode: 'HTML' });
                            } else
                            //------------------HELP------------------//
                            if (command == "help") {
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.help, { admin_name: ctx.from.first_name }), { parse_mode: 'HTML' });
                            } else
                            //------------------CONNECT_FREE------------------//
                            if (command == "connect_free") {
                                let password = ops_cb.misc.new_password();
                                ops_cb.channel.password("free", password);
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.connect, { admin_name: ctx.from.first_name, channel_type: "free", password: password }), { parse_mode: 'HTML' });
                            } else
                            //------------------CONNECT_PAID------------------//
                            if (command == "connect_premium") {
                                let password = ops_cb.misc.new_password();
                                ops_cb.channel.password("paid", password);
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.connect, { admin_name: ctx.from.first_name, channel_type: "premium", password: password }), { parse_mode: 'HTML' });
                            } else
                            //------------------DISCONNECT------------------//
                            if (command == "disconnect") {
                                data.channels.free.password = "";
                                data.channels.free.id = 0;
                                data.channels.free.verified = false;
                                data.channels.paid.password = "";
                                data.channels.paid.id = 0;
                                data.channels.paid.verified = false;
                                db.write('data.json', JSON.stringify(data));
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.disconnect, { bot_name: data.bot.name }), { parse_mode: 'HTML' });
                            } else
                            //------------------SETTINGS------------------//
                            if (command == "settings_help") {
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.settings_help, {}), { parse_mode: 'HTML' });
                            } else
                            if (command == "settings_free_help") {
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.settings_free_help, {}), { parse_mode: 'HTML' });
                            } else
                            if (command == "settings_premium_help") {
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.settings_premium_help, {}), { parse_mode: 'HTML' });
                            } else
                            //------------------PENDING------------------//
                            if (command == "pending") {
                                let pending_list = "";
                                for (let i = 0; i < data.users.memberships.pending.length; i++) {
                                    pending_list += "\n@" + data.users.memberships.pending[i].username + " requested package " + data.users.memberships.pending[i].package + " (" + data.settings.paid.pricing[data.users.memberships.pending[i].package - 1].name + " " + data.settings.paid.pricing[data.users.memberships.pending[i].package - 1].price.amount + " " + data.settings.paid.pricing[data.users.memberships.pending[i].package - 1].price.currency + ")" + " on " + new Date(data.users.memberships.pending[i].requestDate).toDateString()+ " use  <b>/approve#"+data.users.memberships.pending[i].username+"</b> or <b>/remove#"+data.users.memberships.pending[i].username+"</b>" + "\n";
                                }
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.pending, { pending_counter: data.users.memberships.pending.length, pending_list: pending_list }), { parse_mode: 'HTML' });
                            } else
                            //------------------MEMBERSHIPS------------------//
                            if (command == "running") {
                                let running_list = "";
                                for (let i = 0; i < data.users.memberships.running.length; i++) {
                                    if (new Date(data.users.memberships.running[i].validUntill) > new Date()) {
                                        running_list += "\n@" + data.users.memberships.running[i].username + " is running package " + data.users.memberships.running[i].package + " (" + data.settings.paid.pricing[data.users.memberships.running[i].package - 1].name + " " + data.settings.paid.pricing[data.users.memberships.running[i].package - 1].price.amount + " " + data.settings.paid.pricing[data.users.memberships.running[i].package - 1].price.currency + ")" + " since " + new Date(data.users.memberships.running[i].validDate).toDateString() + " untill " + new Date(data.users.memberships.running[i].validUntill).toDateString() + "\n";
                                    }
                                }
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.running, { running_counter: data.users.memberships.running.length, running_list: running_list }), { parse_mode: 'HTML' })
                            } else
                            //------------------STATUS------------------//
                            if (command == "status") {
                                let memberships_counter = data.users.memberships.running.length;
                                let requests_counter = data.users.memberships.pending.length;
                                let free_members_counter = await ctx.getChatMembersCount(data.channels.free);
                                let paid_members_counter = await ctx.getChatMembersCount(data.channels.paid);
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.status, { memberships_counter: memberships_counter, requests_counter: requests_counter, free_members_counter: free_members_counter, paid_members_counter: paid_members_counter }), { parse_mode: 'HTML' });
                            }else
                            //------------------EARNINGS------------------//
                            if (command == "earnings") {
                                let earnings = [];
                                data.users.memberships.running.forEach(function(membership) {
                                    let filter = data.settings.paid.pricing.filter((package) => {
                                        return package.package == membership.package;
                                    });
                                    earnings.push(filter[0].price);
                                });
                                var sum = {};

                                earnings.forEach(function(d) {
                                    if (sum.hasOwnProperty(d.currency)) {
                                        sum[d.currency] = sum[d.currency] + d.amount;
                                    } else {
                                        sum[d.currency] = d.amount;
                                    }
                                });

                                var total_earnings = [];

                                for (var currency in sum) {
                                    total_earnings.push({ currency: currency, amount: sum[currency] });
                                }

                                let earnings_list = "";
                                for (let i = 0; i < total_earnings.length; i++) {
                                    earnings_list += " " + total_earnings[i].amount + " " + total_earnings[i].currency + "\n";
                                }
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.earnings, { earnings_list: earnings_list }), { parse_mode: 'HTML' });
                            }else 
                            //------------------APPROVE------------------//
                            if(command == "approve"){
                                //remove user from pending on username
                                let request_raw = data.users.memberships.pending.filter((request) => {
                                    return request.username == argument_value;
                                });
                                let request = request_raw[0];
                                if (request) {
                                    //add user to running
                                    data.users.memberships.running.push({
                                        id: request.id,
                                        username: request.username,
                                        package: request.package,
                                        validDate: new Date(),
                                        validUntill: new Date(new Date().setDate(new Date().getDate() + data.settings.paid.pricing[request.package - 1].days)),
                                        requestDate: request.requestDate
                                    });
                                }
                                data.users.memberships.pending = data.users.memberships.pending.filter((user) => {
                                    return user.username != argument_value;
                                });
                                //get package data
                                let package = data.settings.paid.pricing.filter((package) => {
                                    return package.package == request.package;
                                })[0];
                                db.write('data.json', JSON.stringify(data));
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.membership_approved, { package_name: package.name, package_duration: package.days, package_price: package.price.amount, package_currency: package.price.currency, channel_link: data.channels.paid }), { parse_mode: 'HTML' });
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.approved, {}), { parse_mode: 'HTML' });
                            }else
                            //------------------APPROVE------------------//
                            if(command == "remove"){
                                //remove user from pending on username
                                data.users.memberships.pending = data.users.memberships.pending.filter((user) => {
                                    return user.username != argument_value;
                                });
                                db.write('data.json', JSON.stringify(data));
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.remove, {}), { parse_mode: 'HTML' });
                            }

                        } else {
                            if (command == "start") {
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.public.start, { user_name: ctx.from.first_name, bot_name: data.bot.name }), { parse_mode: 'HTML' });
                            } else if (command == "help") {
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.public.help, { user_name: ctx.from.first_name, bot_name: data.bot.name }), { parse_mode: 'HTML' });
                            } else if (command == "new_membership") {
                            
                            //verify if this username is already in pending or running
                            let pending = data.users.memberships.pending.filter((user) => {
                                return user.username == ctx.from.username;
                            });
                            let running = data.users.memberships.running.filter((user) => {
                                return user.username == ctx.from.username;
                            });
                            console.log(pending);
                            console.log(running);
                            if (pending.length > 0 ) {
                                package_selected = pending[0].package;
                                let filter = data.settings.paid.pricing.filter((packages) => {
                                    return packages.package == package_selected;
                                });
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.public.membership_already_requested, { package_name: filter[0].name, package_duration: filter[0].duration, package_price: filter[0].price.amount, package_currency: filter[0].price.currency }), { parse_mode: 'HTML' });
                            } else if(running.length > 0) {

                                package_selected = running[0].package;
                                let filter = data.settings.paid.pricing.filter((packages) => {
                                    return packages.package == package_selected;
                                });
                                ctx.reply(ops_cb.misc.message_placeholder(data.messages.public.membership_already_running, { package_name: filter[0].name, package_duration: filter[0].duration, package_price: filter[0].price.amount, package_currency: filter[0].price.currency }), { parse_mode: 'HTML' });
                            }else{
                                
                                let buttons = [];
                                for (let i = 0; i < data.settings.paid.pricing.length; i++) {
                                    buttons.push([{ text: data.settings.paid.pricing[i].name + " (" + data.settings.paid.pricing[i].duration + "days) " + data.settings.paid.pricing[i].price.amount + " " + data.settings.paid.pricing[i].price.currency, callback_data: data.settings.paid.pricing[i].package }]);
                                }

                                ctx.reply("Our available Memberships", {
                                    reply_markup: {
                                        inline_keyboard: buttons
                                    }
                                });
                            }
                            }
                        };
                    }
                })
        },
    },
    bot: {
        set(name, description) {
            db.read('data.json')
                .then(data => {
                    data = JSON.parse(data);
                    if (name) data.bot_name = name;
                    if (description) data.bot_description = description;
                    db.write('data.json', JSON.stringify(data));
                })
        },
    },
    channel: {
        password(type, password) {
            db.read('data.json')
                .then(data => {
                    data = JSON.parse(data);
                    if (type && password) {
                        data.channels[type].password = password;
                        data.channels[type].verified = false;
                        db.write('data.json', JSON.stringify(data));
                    }
                })
        },
        verify(type, password, channel_id, ctx, ops_cb) {
            db.read('data.json')
                .then(data => {
                    data = JSON.parse(data);
                    if (password.toString().toUpperCase() == data.channels[type].password.toString().toUpperCase()) {
                        data.channels[type].id = channel_id;
                        data.channels[type].verified = true;
                        db.write('data.json', JSON.stringify(data));
                        ctx.reply(ops_cb.misc.message_placeholder(data.messages.admin.link_success, { channel_type: type, bot_name: data.bot.name }), { parse_mode: 'HTML' });
                    }
                })
        }

    },
    misc: {
        message_placeholder: function(message, data) {
            return message.replace("{bot_name}", data.bot_name).replace("{bot_description}", data.bot_description).replace("{admin_name}", data.admin_name).replace("{channel_type}", data.channel_type).replace("{password}", data.password).replace("{pending_counter}", data.pending_counter).replace("{pending_list}", data.pending_list).replace("{user_name}", data.user_name).replace("{running_counter}", data.running_counter).replace("{running_list}", data.running_list).replace("{premium_members_memberships}", data.memberships_counter).replace("{premium_pending_counter}", data.requests_counter).replace("{free_members_counter}", data.free_members_counter).replace("{premium_members_counter}", data.paid_members_counter).replace("{earnings_list}", data.earnings_list).replace("{package_name}", data.package_name).replace("{package_duration}", data.package_duration).replace("{package_price}", data.package_price).replace("{package_currency}", data.package_currency);
        },
        new_password: function() {
            return Math.floor(Math.random() * 1000000);
        },
    },
    user: {
        membership:async function(ctx, ops_cb,action) {
            dumb_filter = action.split("_");
            let package_selected = dumb_filter[dumb_filter.length-1];
            let data =await db.read('data.json');
            data = JSON.parse(data);
            let filter = data.settings.paid.pricing.filter((packages) => {
                return packages.package == package_selected;
            });
         ctx.answerCbQuery(ops_cb.misc.message_placeholder(data.messages.public.membership_selected, { package_name: filter[0].name, package_duration: filter[0].duration, package_price: filter[0].price.amount, package_currency: filter[0].price.currency }), { parse_mode: 'HTML' });
         console.log(ctx)
         ctx.deleteMessage();
         let new_membership_request = {
            "id": ctx.chat.id,
            "username": ctx.from.username,
            "name":  ctx.from.first_name,
            "verified": false,
            "package": package_selected,
            "requestDate": new Date().getTime()
        }
        data.users.memberships.pending.push(new_membership_request);
        db.write('data.json', JSON.stringify(data));

         ctx.reply(ops_cb.misc.message_placeholder(data.messages.public.membership_pending, { package_name: filter[0].name, package_duration: filter[0].duration, package_price: filter[0].price.amount, package_currency: filter[0].price.currency }), { parse_mode: 'HTML' });
        },
    }




}

module.exports = ops;