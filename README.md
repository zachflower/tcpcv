# TCPCV

![Node.js CI](https://github.com/zachflower/tcpcv/workflows/Node.js%20CI/badge.svg)

TCPCV is a retro-style, text-based server for hosting your resume.

![TCPCV demo](.github/demo.gif)

## Requirements

TCPCV has been tested with the following dependencies:

- Node.js v10+

## Installation

```
npm install --global tcpcv
```

## Usage

```
$ tcpv --help

  TCPCV is a retro-style, text-based server for hosting your resume

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

Without a resume, TCPCV would be effectively useless, so the `--resume` option is by far the most important. By default, this will look for a file called `resume.json` in the current directory, however you can override the path using this option. [See below](#configuration) more information about the `resume.json` file format.

## Configuration

By default, TCPCV expects a `resume.json` file in the executing directory to fill out the resume details. At its core, this file allows you to define an arbitrary number of sections—with two different section formats—giving you the flexibility to display the information that _you_ care about. As an example, let's take a look at the `resume.example.json` file in this repository:

```json
{
  "sections": {
    "info": {
      "title": "Info",
      "description": "Personal information",
      "data": [
        "Name: Jean-Luc Picard",
        "Email: jluc@starfleet.gov",
        "Tea: Earl Grey, Hot"
      ]
    },
    "education": {
      "title": "Education",
      "description": "Education history",
      "data": [
        {
          "header": [
            "Starfleet Academy",
            "San Francisco, United Earth"
          ],
          "subheader": [
            "Officer",
            "2323 - 2327"
          ]
        }
      ]
    },
    "employment": {
      "title": "Employment",
      "description": "Employment history",
      "data": [
        {
          "header": [
            "Starfleet",
            "San Francisco, United Earth"
          ],
          "subheader": [
            "Captain",
            "2333 - 2379"
          ],
          "body": "Ascended from bridge officer to captain on the USS Stargazer. Commanded the Stargazer for two decades. Creator of the \"Picard Maneuver.\" Commanded the USS Enterprise-D and Enterprise-E, exploring the great, unexplored mass."
        }
      ]
    }
  }
}
```

When parsed, this file is rendered for the end-user like so:

```
$ resume

--------------------------------------------------------------------------------
Info
--------------------------------------------------------------------------------
Name: Jean-Luc Picard
Email: jluc@starfleet.gov
Tea: Earl Grey, Hot

--------------------------------------------------------------------------------
Education
--------------------------------------------------------------------------------
Starfleet Academy                                    :  San Francisco, United Earth
Officer                                              :  2323 - 2327

--------------------------------------------------------------------------------
Employment
--------------------------------------------------------------------------------
Starfleet                                            :  San Francisco, United Earth
Captain                                              :  2333 - 2379
    Ascended from bridge officer to captain on the USS Stargazer. Commanded the
    Stargazer for two decades. Creator of the "Picard Maneuver." Commanded the
    USS Enterprise-D and Enterprise-E, exploring the great, unexplored mass.
```

### String Blocks

As you can see, when a raw `string` is defined in a section's `data` block, it gets rendered exactly as written:

```json
"data": [
  "Name: Jean-Luc Picard",
  "Email: jluc@starfleet.gov",
  "Tea: Earl Grey, Hot"
]
```

Becomes:

```
Name: Jean-Luc Picard
Email: jluc@starfleet.gov
Tea: Earl Grey, Hot
```

### Object Blocks

Alternatively, a more structured format can be used to make the output a little cleaner:

```json
"data": [
  {
    "header": [
      "Starfleet",
      "San Francisco, United Earth"
    ],
    "subheader": [
      "Captain",
      "2333 - 2379"
    ],
    "body": "Ascended from bridge officer to captain on the USS Stargazer. Commanded the Stargazer for two decades. Creator of the \"Picard Maneuver.\" Commanded the USS Enterprise-D and Enterprise-E, exploring the great, unexplored mass."
  }
]
```

Becomes:

```
Starfleet                                            :  San Francisco, United Earth
Captain                                              :  2333 - 2379
    Ascended from bridge officer to captain on the USS Stargazer. Commanded the
    Stargazer for two decades. Creator of the "Picard Maneuver." Commanded the
    USS Enterprise-D and Enterprise-E, exploring the great, unexplored mass.
```

The `header` and `subheader` values allow you to cleanly separate names, titles, locations, and dates in a clearly readable format, while the `body` value can be filled out to provide more detail about the entry—and, for the record, `body` is word-wrapped at `76` characters, so you don't have to worry about formatting.

**Note:** It's important to note that the `header`, `subheader`, and `body` values are all optional, so you can have a little control, over what gets displayed and where.

## Contributing

Please read through the [contributing guidelines](https://github.com/zachflower/tcpcv/blob/master/.github/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

## Support

The [issue tracker](https://github.com/zachflower/tcpcv/issues) is the preferred channel for bug reports, feature requests and submitting pull requests.

## License

TCPCV is licensed under the MIT License.