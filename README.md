# Resume Telnet Server

This is a novel Node.js telnet server that I built to both get my feet wet with Node.js,
and to serve my resume. To connect to the server, open up a terminal and enter the following:

    telnet resume.zacharyflower.com 2468

## Configuration

The resume sections are dynamically generated via a required `config.js` file.
An example configuration file (`config-sample.js`) has been provided.

### Port

Update the `port` value to change the port the resume server listens on. Ports
below 1024 will require root access.

### MotD

The `motd` (or Message of the Day) value is used to generate the ASCII-art name
displayed when someone connects to the resume server.

```
  _____          _                      _____ _
 |__  /__ _  ___| |__   __ _ _ __ _   _|  ___| | _____      _____ _ __
   / // _` |/ __| '_ \ / _` | '__| | | | |_  | |/ _ \ \ /\ / / _ \ '__|
  / /| (_| | (__| | | | (_| | |  | |_| |  _| | | (_) \ V  V /  __/ |
 /____\__,_|\___|_| |_|\__,_|_|   \__, |_|   |_|\___/ \_/\_/ \___|_|
                                  |___/
```

## Usage

To run your server, clone this repository and run the following command from within the directory:

    node server.js

To keep your server running in the background, check out https://github.com/foreverjs/forever,
an awesome command-line tool for running node packages continuously.

## Server Commands

### Resume / CV

View entire resume.

    $ resume

#### Resume Commands

Resume commands are dynamically generated via the `config.js` file. Here are
some example commands implemented in the demo config: 

##### Achievements

View awards and achievements section.

    $ resume achievements

##### Education

View education section.

    $ resume education
    
##### Employment
    
View employment history section.
    
    $ resume employment
    
##### Info

View personal information section.

    $ resume info
    
##### Projects

View personal projects section.

    $ resume projects

### Help

View help screen.

### Exit / Quit

Quit out of the resume.
