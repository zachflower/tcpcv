# TCPCV

TCPCV is a retro-style, text-based server for hosting your résumé.

## Requirements

TCPCV has been tested with the following dependencies:

- Node.js v14.4.0+
- npm v6.14.4+

## Installation

```
npm install --global tcpcv
```

## Usage

```
$ tcpv --help

  TCPCV is a retro-style, text-based server for hosting your résumé

  Usage:
    tcpcv [options]

  Options:
    --help            Display this help message
    --motd[=MOTD]     The hero text to display on connection (default: TCPCV)
    --port[=PORT]     The port to listen on (default: 2468)
    --resume[=RESUME] Path to the resume file (default: resume.json)
    --version         Display this application version
```

### `--motd[=MOTD]`

By default, when a user connects to a TCPCV server, they are greeted with a generic hero text that we are calling our MOTD. It looks something like this:

```
  _____ ____ ____   ______     __
 |_   _/ ___|  _ \ / ___\ \   / /
   | || |   | |_) | |    \ \ / /
   | || |___|  __/| |___  \ V /
   |_| \____|_|    \____|  \_/
```

The `--motd` option can be used to override this text. For example, `--motd="Jean-Luc Picard"` would change the MOTD to this:

```
      _                        _                 ____  _                   _
     | | ___  __ _ _ __       | |   _   _  ___  |  _ \(_) ___ __ _ _ __ __| |
  _  | |/ _ \/ _` | '_ \ _____| |  | | | |/ __| | |_) | |/ __/ _` | '__/ _` |
 | |_| |  __/ (_| | | | |_____| |__| |_| | (__  |  __/| | (_| (_| | | | (_| |
  \___/ \___|\__,_|_| |_|     |_____\__,_|\___| |_|   |_|\___\__,_|_|  \__,_|
```

**Note:** Keep in mind that the MOTD is _not_ word-wrapped, so use your best judgement when deciding on its length.

### `--port[=PORT]`

TCPCV is hosted on port `2468` by default, however this can be overridden with the `--port` option. Keep in mind that any port under `1024` is considered a system port, and will require root and is highly discouraged.

**Note:** It may be tempting to bind TCPCV to port `23`, the default Telnet port, however at this time TCPCV does not properly handle IAC commands, which will result in some unexpected behavior. If you'd like to add IAC support, please open a [pull request](https://github.com/zachflower/tcpcv/compare).

### `--resume[=RESUME]`

Without a resume, TCPCV would be effectively useless, so the `--resume` option is by far the most important. By default, this will look for a file called `resume.json` in the current directory, however you can override the path using this option.

## Contributing

Please read through the [contributing guidelines](https://github.com/zachflower/tcpcv/blob/master/.github/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

## Support

The [issue tracker](https://github.com/zachflower/tcpcv/issues) is the preferred channel for bug reports, feature requests and submitting pull requests.

## License

TCPCV is licensed under the MIT License.