const telegram = require('./utils/telegram.js')
const ops = require('./utils/ops.js')

//----------------ADMIN SECTION--------------------//

telegram.bot.start((ctx) => {
    ops.admin.is(ctx, ops, "start");
})
telegram.bot.help((ctx) => {
    ops.admin.is(ctx, ops, "help");
})

telegram.bot.command('connect_free', (ctx) => {
    ops.admin.is(ctx, ops, "connect_free");
})
telegram.bot.command('connect_premium', (ctx) => {
    ops.admin.is(ctx, ops, "connect_premium");
})
telegram.bot.command('disconnect', (ctx) => {
    ops.admin.is(ctx, ops, "disconnect");
})
telegram.bot.command('settings', (ctx) => {
    let argument = ctx.message.text.split("#")[1];
    if (argument) {
        let argument_name = argument.split("=")[0];
        let argument_value = argument.split("=")[1];
        ops.admin.is(ctx, ops, "settings", argument_name, argument_value);
    }else{
        ops.admin.is(ctx, ops, "settings_help");
    }
})
telegram.bot.command('settings_free', (ctx) => {
    let argument = ctx.message.text.split("#")[1];
    if (argument) {
        let argument_name = argument.split("=")[0];
        let argument_value = argument.split("=")[1];
        ops.admin.is(ctx, ops, "settings_free", argument_name, argument_value);
    }else{
        ops.admin.is(ctx, ops, "settings_free_help");
    }
})
telegram.bot.command('settings_premium', (ctx) => {
    let argument = ctx.message.text.split("#")[1];
    if (argument) {
        let argument_name = argument.split("=")[0];
        let argument_value = argument.split("=")[1];
        ops.admin.is(ctx, ops, "settings_premium", argument_name, argument_value);
    }else{
        ops.admin.is(ctx, ops, "settings_premium_help");
    }
})
telegram.bot.command('pending', (ctx) => {
    ops.admin.is(ctx, ops, "pending");
})
telegram.bot.command('running', (ctx) => {
    ops.admin.is(ctx, ops, "running");
})
telegram.bot.command('status',async  (ctx) => {
   await ops.admin.is(ctx, ops, "status");
})
telegram.bot.command('earnings', (ctx) => {
    ops.admin.is(ctx, ops, "earnings");
    })

telegram.bot.on("channel_post", (ctx) => {
    let message = ctx.update.channel_post.text;
    let channel_id = ctx.update.channel_post.chat.id;
    ops.channel.verify("free", message, channel_id, ctx, ops);
    ops.channel.verify("paid", message, channel_id, ctx, ops);
})
telegram.bot.command("remove", (ctx) => {
    let username = ctx.message.text.split("#")[1];
    ops.admin.is(ctx, ops, "remove","username", username);
})
telegram.bot.command("approve", (ctx) => {
    let username = ctx.message.text.split("#")[1];
    ops.admin.is(ctx, ops, "approve","username", username);
})
//---------------!ADMIN SECTION!-------------------//

//---------------USER SECTION------------------//
telegram.bot.command('/new_membership', (ctx) => {
    ops.admin.is(ctx, ops, "new_membership");
})
telegram.bot.action(/.+/, async (ctx) => {
    let action = ctx.update.callback_query.data;
    await ops.user.membership(ctx, ops, action);
    
})
//---------------!USER SECTION!------------------//

telegram.bot.launch()

process.once('SIGINT', () => telegram.bot.stop('SIGINT'));
process.once('SIGTERM', () => telegram.bot.stop('SIGTERM'));