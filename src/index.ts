import { Socket, createServer, AddressInfo } from 'net';
import { existsSync, statSync, readFileSync } from 'fs';
import { sprintf, vsprintf } from 'sprintf-js';
import * as wrap from 'word-wrap';
import * as meow from 'meow';
import * as signale from 'signale';
import * as figlet from 'figlet';

const cli = meow(`
  Usage:
    tcpcv [options]

  Options:
    --help            Display this help message
    --motd[=MOTD]     The hero text to display on connection (default: TCPCV)
    --port[=PORT]     The port to listen on (default: 2468)
    --resume[=RESUME] Path to the resume file (default: resume.json)
    --version         Display this application version
`, {
  flags: {
    motd: {
      type: 'string',
      default: 'TCPCV'
    },
    port: {
      type: 'number',
      default: 2468
    },
    resume: {
      type: 'string',
      default: 'resume.json'
    }
  }
});

signale.config({
  displayBadge: true,
  displayTimestamp: true,
  displayDate: true
});

if (!existsSync(cli.flags.resume)) {
  const error = new Error(`No such file or directory, '${cli.flags.resume}'`);
  signale.fatal(error);

  throw error;
}

signale.info('Loading resume from', cli.flags.resume);

const stats = statSync(cli.flags.resume);
const resume = JSON.parse(readFileSync(cli.flags.resume, 'utf8'));

/*
 * Global Variables
 */
const sockets = new Array<Socket>();
let lastInput = '';

/**
 * Cleans the input of carriage return, newline
 *
 * @param data
 */
const cleanInput = (data: string): string => {
  const ctrld = Buffer.from('04');

  /*
   * Convert Ctrl+D to 'exit'
   */
  if (Buffer.from(data) === ctrld) {
    return 'exit';
  }

  return data.toString().replace(/(\r\n|\n|\r)/gm, '').toLowerCase();
};

/**
 * Send Data to Socket
 *
 * @param socket
 * @param data
 */
const sendData = (socket: Socket, data: string): void => {
  socket.write(data);
  socket.write('$ ');
};

/*
 * Method executed when data is received from a socket
 */
const receiveData = (socket: Socket, data: string) => {
  let cleanData = cleanInput(data);

  if (cleanData === '!!') {
    cleanData = lastInput;
  } else {
    lastInput = cleanData;
  }

  let output = '';

  switch (cleanData) {
    case '':
      sendData(socket, output);
      break;
    case 'quit':
    case 'exit':
      socket.end('Goodbye!\n');
      break;
    case 'help':
      output += 'These shell commands are defined internally.  Type \'help\' to see this list.\n';
      output += 'Type \'help <command>\' for more information about a particular command.\n';

      output += '\n';
      output += 'Commands:\n';
      output += '  cv                         :  Display resume information\n';
      output += '  exit                       :  Exit the resume\n';
      output += '  help                       :  Display this help text\n';
      output += '  quit                       :  Exit the resume\n';
      output += '  resume                     :  Display resume information\n\n';

      sendData(socket, output);
      break;
    case 'help cv':
    case 'help resume':
      output += 'These shell commands are defined via a config file.  Type \'help resume\' to see this list.\n';
      output += '\n';
      output += 'Commands:\n';
      output += '  resume                            :  Full resume\n';

      for (const section in resume.sections) {
        if (Object.prototype.hasOwnProperty.call(resume.sections, section)) {
          output += vsprintf('  resume %-25s  :  %-25s\n', [section, resume.sections[section].description]);
        }
      }

      output += '\n';

      sendData(socket, output);
      break;
    case 'cv':
    case 'resume':
      for (const section in resume.sections) {
        if (Object.prototype.hasOwnProperty.call(resume.sections, section)) {
          output += resumeSection(section);
        }
      }

      sendData(socket, output);
      break;
    default:
      if (/^(resume|cv) /.test(cleanData)) {
        const section = cleanData.replace(/^(resume|cv) /, '');

        if (Object.prototype.hasOwnProperty.call(resume.sections, section)) {
          output = resumeSection(section);

          sendData(socket, output);
          break;
        }
      }

      sendData(socket, '-resume: ' + cleanData + ': command not found\n');
      break;
  }
};

const resumeSection = (section: string) => {
  let output = '';

  if (Object.prototype.hasOwnProperty.call(resume.sections, section)) {
    output += '--------------------------------------------------------------------------------\n';
    output += sprintf('%s\n', resume.sections[section].title);
    output += '--------------------------------------------------------------------------------\n';

    let stringlast = false;

    for (const block of resume.sections[section].data) {
      if (typeof block === 'string' || block instanceof String) {
        output += sprintf('%s\n', block);

        stringlast = true;
      } else {
        if (Object.prototype.hasOwnProperty.call(block, 'header')) {
          output += vsprintf('%-51s  :  %-24s\n', block.header);
        }

        if (Object.prototype.hasOwnProperty.call(block, 'subheader')) {
          output += vsprintf('%-51s  :  %-24s\n', block.subheader);
        }

        if (Object.prototype.hasOwnProperty.call(block, 'body')) {
          output += sprintf('%s\n', wrap(block.body, { indent: '    ', width: 76 }));
        }

        output += '\n';

        stringlast = false;
      }
    }

    if (stringlast) {
      output += '\n';
    }
  }

  return output;
};

/*
 * Method executed when a socket ends
 */
const closeSocket = (socket: Socket) => {
  const i = sockets.indexOf(socket);

  if (i !== -1) {
    sockets.splice(i, 1);
  }
};

/*
 * Callback method executed when a new TCP socket is opened.
 */
const newSocket = (socket: Socket) => {
  signale.info('New connection from', socket.remoteAddress);

  sockets.push(socket);
  socket.write('\n');
  socket.write(`Last updated: ${stats.mtime.toUTCString()}\n`);
  socket.write('\n');
  socket.write(figlet.textSync(cli.flags.motd));
  socket.write('\n');

  sendData(socket, 'Type \'help\' for more information.\n');

  socket.on('data', (data: string) => {
    receiveData(socket, data);
  });

  socket.on('end', () => {
    closeSocket(socket);
  });
};

const server = createServer(newSocket);
server.listen(cli.flags.port);

const { port } = server.address() as AddressInfo;

signale.success(`TCPCV is ready to rock on port ${port}!`);
