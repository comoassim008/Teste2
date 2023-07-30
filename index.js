const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const CatLoggr = require('cat-loggr');
const client = new Discord.Client();
const log = new CatLoggr();

client.commands = new Discord.Collection();
client.on('warn', message => log.warn(message));
client.on('error', error => log.error(error));

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    log.init(`✅ | Comando carregado: ${command.name}`);
	client.commands.set(command.name, command);
};
    
client.login(config.token);
client.on('ready', () => {
    console.clear() 
	console.log(`✅  | Bot logado com Sucesso.
✅  | Yui99#9999
✅  | Sistema Atualizado V2`);
    client.user.setActivity(`Yui99#9999`, { type: "STREAMING", url: "" });
});

process.on('unhandledRejection', (reason, p) => {
    console.log('❌ | Script Rejeitado')
    console.log(reason, p)
  });
  process.on('multipleResolves', (type, promise, reason) => {
    console.log('❌ | Vários erros encontrados')
    console.log(type, promise, reason)
  });
  process.on('uncaughtExceptionMonito', (err, origin) => {
    console.log('❌ | Sistema bloqueado')
    console.log(err, origin)
  });
  process.on('uncaughtException', (err, origin) => {
    console.log('❌ | Erro encontrado')
    console.log(err, origin)
  });

client.on('message', (message) => {
	if (!message.content.startsWith(config.prefix)) return;
	if (message.author.bot) return;
	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	if (config.command.notfound_message === true && !client.commands.has(command)) {
            new Discord.MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Comando não encontrado :(')
            .setDescription(`Desculpe, mas não consigo encontrar o \`${command}\` commando!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))

    };

	try {
	client.commands.get(command).execute(message, args);
	} catch (error) {
    if (config.command.error_message === true) {
     new Discord.MessageEmbed()
    .setColor(config.color.red)
    .setTitle('Error occurred!')
    .setDescription(`An error occurred while executing the \`${command}\` command!`)
    .addField('Error', `\`\`\`js\n${error}\n\`\`\``)
    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
    .setTimestamp()
        };
	};
});

