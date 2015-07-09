/*
 * Sources:
 *  http://www.davidmclifton.com/2011/07/22/simple-telnet-server-in-node-js/
 */

var net = require('net');
var figlet = require('figlet');
var sprintf = require("sprintf-js").sprintf;
var vsprintf = require("sprintf-js").vsprintf;
var wrap = require('word-wrap');
var config = require('./config');

/*
 * Global Variables
 */
var sockets = [];
var lastInput = '';

/*
 * Cleans the input of carriage return, newline
 */
function cleanInput(data) {
	return data.toString().replace(/(\r\n|\n|\r)/gm,"").toLowerCase();
}

/*
 * Send Data to Socket
 */
function sendData(socket, data) {
	socket.write(data);
	socket.write("$ ");
}

/*
 * Method executed when data is received from a socket
 */
function receiveData(socket, data) {
	var cleanData = cleanInput(data);

	if ( cleanData != '!!' ) {
		lastInput = cleanData;
	} else {
		cleanData = lastInput;
	}

	var output = "";

	switch ( cleanData ) {
		case 'quit':
		case 'exit':
			socket.end('Goodbye!\n');
			break;
		case 'help':
			output += "These shell commands are defined internally.  Type 'help' to see this list.\n";
			output += "Type 'help <command>' for more information about a particular command.\n";

			output += "\n";
			output += "Commands:\n";
			output += "  cv                         :  Display resume information\n";
			output += "  exit                       :  Exit the resume\n";
			output += "  help                       :  Display this help text\n";
			output += "  quit                       :  Exit the resume\n";
			output += "  resume                     :  Display resume information\n\n";

			sendData(socket, output);
			break;
		case 'help cv':
		case 'help resume':
			output += "These shell commands are defined internally.  Type 'help resume' to see this list.\n";
			output += "\n";
			output += "Commands:\n";
			output += "  resume                            :  Full resume\n";

			for ( section in config.sections ) {
				output += vsprintf("  resume %-25s  :  %-25s\n", [section, config.sections[section].description]);
			}

			output += "\n";

			sendData(socket, output);
			break;
		case 'cv':
		case 'resume':
			for ( section in config.sections ) {
				output += resumeSection(section);
			}

			sendData(socket, output);
			break;
		default:
			if ( cleanData.match(/^(resume|cv) /) ) {
				var section = cleanData.replace(/^(resume|cv) /, '');

				if ( config.sections.hasOwnProperty(section) ) {
					output = resumeSection(section);

					sendData(socket, output);
					break;
				}
			}

			sendData(socket, "-resume: " + cleanData + ": command not found");
			break;
	}
}

function resumeSection(section) {
	var output = "";

	if ( config.sections.hasOwnProperty(section) ) {
		output += "--------------------------------------------------------------------------------\n";
		output += sprintf("%s\n", config.sections[section].title);
		output += "--------------------------------------------------------------------------------\n";

		stringlast = false;

		config.sections[section].data.forEach(function(block) {
			if ( typeof block === 'string' || block instanceof String ) {
				output += sprintf("%s\n", block);

				stringlast = true;
			} else {
				if ( block.hasOwnProperty('header') ) {
					output += vsprintf("%-51s  :  %-24s\n", block.header);
				}

				if ( block.hasOwnProperty('subheader') ) {
					output += vsprintf("%-51s  :  %-24s\n", block.subheader);
				}

				if ( block.hasOwnProperty('body') ) {
					output += sprintf("%s\n", wrap(block.body, {indent: '    ', width: 76}));
				}

				output += "\n";

				stringlast = false
			}
		});

		if ( stringlast ) {
			output += "\n";
		}
	}

	return output;
}

/*
 * Method executed when a socket ends
 */
function closeSocket(socket) {
	var i = sockets.indexOf(socket);

	if (i != -1) {
		sockets.splice(i, 1);
	}
}
 
/*
 * Callback method executed when a new TCP socket is opened.
 */
function newSocket(socket) {
	sockets.push(socket);
	socket.write("\n");
	socket.write("Last updated: Wed May 14 18:59:40 MST by Zachary Flower\n");
	socket.write("\n");
	socket.write(figlet.textSync(config.motd));
	socket.write("\n");

	sendData(socket, "Type 'help' for more information.\n");

	socket.on('data', function(data) {
		receiveData(socket, data);
	})

	socket.on('end', function() {
		closeSocket(socket);
	})
}
 
var server = net.createServer(newSocket);
server.listen(config.port);
