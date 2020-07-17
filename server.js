/*
 * Sources:
 *  http://www.davidmclifton.com/2011/07/22/simple-telnet-server-in-node-js/
 */

const net = require('net');
const fs = require('fs');
const figlet = require('figlet');
const sprintf = require("sprintf-js").sprintf;
const vsprintf = require("sprintf-js").vsprintf;
const wrap = require('word-wrap');

const MOTD = process.env.MOTD || "Zachary Flower";
const PORT = process.env.PORT || 2468;
const RESUME = process.env.RESUME || "resume.json";

try {
  require.resolve('./config');
} catch(e) {
  console.error("config.js file not found, use config-sample.js as a reference");
  process.exit(e.code);
}

const config = require('./config');
const stats = fs.statSync(RESUME);
const resume = JSON.parse(fs.readFileSync(RESUME, 'utf8'));

/*
 * Global Variables
 */
let sockets = [];
let lastInput = '';

/*
 * Cleans the input of carriage return, newline
 */
const cleanInput = (data) => {
  const ctrld = Buffer.from([04]);

  /*
   * Convert Ctrl+D to 'exit'
   */
  if ( data.equals(ctrld) ) {
      return 'exit';
  }

  return data.toString().replace(/(\r\n|\n|\r)/gm,"").toLowerCase();
};

/*
 * Send Data to Socket
 */
const sendData = (socket, data) => {
  socket.write(data);
  socket.write("$ ");
};

/*
 * Method executed when data is received from a socket
 */
const receiveData = (socket, data) => {
  let cleanData = cleanInput(data);

  if ( cleanData != '!!' ) {
    lastInput = cleanData;
  } else {
    cleanData = lastInput;
  }

  let output = "";

  switch ( cleanData ) {
    case '':
      sendData(socket, output);
      break;
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
      output += "These shell commands are defined via a config file.  Type 'help resume' to see this list.\n";
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
        const section = cleanData.replace(/^(resume|cv) /, '');

        if ( config.sections.hasOwnProperty(section) ) {
          output = resumeSection(section);

          sendData(socket, output);
          break;
        }
      }

      sendData(socket, "-resume: " + cleanData + ": command not found\n");
      break;
  }
};

const resumeSection = (section) => {
  let output = "";

  if ( config.sections.hasOwnProperty(section) ) {
    output += "--------------------------------------------------------------------------------\n";
    output += sprintf("%s\n", config.sections[section].title);
    output += "--------------------------------------------------------------------------------\n";

    stringlast = false;

    config.sections[section].data.forEach((block) => {
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
};

/*
 * Method executed when a socket ends
 */
const closeSocket = (socket) => {
  const i = sockets.indexOf(socket);

  if (i != -1) {
    sockets.splice(i, 1);
  }
};

/*
 * Callback method executed when a new TCP socket is opened.
 */
const newSocket = (socket) => {
  sockets.push(socket);
  socket.write("\n");
  socket.write("Last updated: " + stats.mtime.toUTCString() + " by Zachary Flower\n");
  socket.write("\n");
  socket.write(figlet.textSync(MOTD));
  socket.write("\n");

  sendData(socket, "Type 'help' for more information.\n");

  socket.on('data', (data) => {
    receiveData(socket, data);
  });

  socket.on('end', () => {
    closeSocket(socket);
  });
};

const server = net.createServer(newSocket);
server.listen(PORT);
