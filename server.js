/*
 * Sources:
 *  http://www.davidmclifton.com/2011/07/22/simple-telnet-server-in-node-js/
 */

var net = require('net');

/*
 * Config Variables
 */
var config = {
	port: 2345
};

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
	socket.write(data + "\n\n");
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
			output += "  resume                     :  Display resume information";

			sendData(socket, output);
			break;
		case 'help cv':
		case 'help resume':
			output += "These shell commands are defined internally.  Type 'help resume' to see this list.\n";
			output += "\n";
			output += "Commands:\n";
			output += "  resume                            :  Full resume\n";
			output += "  resume achievements               :  Awards & achievements\n";
			output += "  resume education                  :  Education history\n";
			output += "  resume employment                 :  Employment history\n";
			output += "  resume info                       :  Personal information\n";
			output += "  resume projects                   :  Personal projects";

			sendData(socket, output);
			break;
		case 'cv':
		case 'resume':
			output += resumeSection('info');
			output += "\n\n";
			output += resumeSection('education');
			output += "\n\n";
			output += resumeSection('employment');
			output += "\n\n";
			output += resumeSection('achievements');
			output += "\n\n";
			output += resumeSection('projects');

			sendData(socket, output);
			break;
		case 'cv info':
		case 'resume info':
			output = resumeSection('info');

			sendData(socket, output);
			break;
		case 'cv education':
		case 'resume education':
			output = resumeSection('education');

			sendData(socket, output);
			break;
		case 'cv employment':
		case 'resume employment':
			output = resumeSection('employment');

			sendData(socket, output);
			break;
		case 'cv achievements':
		case 'resume achievements':
			output = resumeSection('achievements');

			sendData(socket, output);
			break;
		case 'cv projects':
		case 'resume projects':
			output = resumeSection('projects');

			sendData(socket, output);
			break;
		default:
			sendData(socket, "-resume: " + cleanData + ": command not found");
			break;
	}
}

function resumeSection(section) {
	var output = "";

	switch ( section ) {
		case 'info':
			output += "                           Zachary M. Flower\n\n";
			output += "                         zach@zacharyflower.com";

			break;
		case 'achievements':
			output += "------------------------------------------------------------------------------\n";
			output += "Achievements\n";
			output += "------------------------------------------------------------------------------\n";
			output += "Broadcast Engineering Magazine Excellence Award      :  Fall 2010\n";
			output += "    Design Team Project Engineer\n\n";
			output += "CI Engineering Design Expo Project Award             :  Spring 2010\n";
			output += "    Computer Science Capstone Awarded \"Best in \n";
			output += "    Section\"\n\n";
			output += "Competed in Imagine Cup Regional Semi-Finals         :  Spring 2007\n";
			output += "    Imagine Cup is a Programming Competition\n";
			output += "    hosted by Microsoft";

			break;
		case 'education':
			output += "------------------------------------------------------------------------------\n";
			output += "Education\n";
			output += "------------------------------------------------------------------------------\n";
			output += "University of Colorado at Boulder                    : Boulder, CO\n";
			output += "B.S. in Computer Science                             : Fall 2005 - Spring 2010";

			break;
		case 'employment':
			output += "------------------------------------------------------------------------------\n";
			output += "Employment\n";
			output += "------------------------------------------------------------------------------\n";
			output += "Buffer                                               : San Francisco, CA      \n";
			output += "Backend Hacker                                       : Jan. 2014 - May 2014   \n";
			output += "    Full-time work-from-home position; Developed in PHP; Developed on top of a\n";
			output += "    highly modified CodeIgniter framework; Developed RSS feed importing       \n";
			output += "    feature; Made various updates and bug fixes to the Buffer API and web app;\n";
			output += "    Implemented multiple security features, including user session management,\n";
			output += "    multiple failed login lockouts, and API token management; Implemented     \n";
			output += "    real-time Twitter analytics tracking and semi-real-time Facebook,         \n";
			output += "    Linkedin, and Google+ analytics tracking; Made numerous improvements to   \n";
			output += "    analytics tracking and reporting functionality; Introduced New Relic      \n";
			output += "    monitoring; Worked on top of Amazon AWS stack utilizing SQS, EC2, S3, and \n";
			output += "    Elastic Beanstalk; Worked directly with customers to solve more technical \n";
			output += "    issues.\n\n";

			output += "Mocavo, Inc.                                         : Boulder, CO            \n";
			output += "Senior Backend Software Developer                    : Aug. 2011 - Aug. 2013  \n";
			output += "    Developed in PHP; Developed on top of a highly modified CodeIgniter       \n";
			output += "    framework; Wrote various crawlers for gathering data from Google,         \n";
			output += "    Ancestry.com, and Archives.com, among others; Designed and implemented a  \n";
			output += "    natural language processing system to bring structure to unstructured     \n";
			output += "    search results, allowing users to run sophisticated queries based on      \n";
			output += "    location, date ranges, first name alternates, similar last names, and     \n";
			output += "    events; Implemented order system using BrainTree Gateway; Developed       \n";
			output += "    RESTful API for Mocavo mobile apps; Implemented standalone OCR system;    \n";
			output += "    Developed automatic search service, allowing users to upload family trees \n";
			output += "    and have search results based on multiple algorithms mailed to them       \n";
			output += "    weekly; Integrated several third party APIs (Dropbox, Geni, BrainTree);   \n";
			output += "    Built and maintained extensive administrative tools for support staff;    \n";
			output += "    Developed backend for custom family tree builder; Created word-           \n";
			output += "    highlighting thumbnail generator using OCR word coordinates.\n\n";

			output += "Name.com                                             : Denver, CO             \n";
			output += "Software Developer                                   : Oct. 2010 - Aug. 2011  \n";
			output += "    Developed in PHP; Developed on top of a highly modified CodeIgniter       \n";
			output += "    framework; Designed and developed the first version of Name.com’s mobile  \n";
			output += "    website; Implemented various ccTLDs (.BE, .LI, .CH); Responsible for all  \n";
			output += "    domain name transfer functionality; Developed RESTful API for Name.com    \n";
			output += "    sister site, Who.is; Integrated numerous third party APIs for use through \n";
			output += "    the Name.com website (Tropo, DevHub, MobileView, DIYSEO); Implemented     \n";
			output += "    Unofficial API for integration with About.me; Lead developer on various   \n";
			output += "    product implementations (PageZen and SEOTutor).\n\n";

			output += "Omnibus Systems                                      : Golden, CO             \n";
			output += "Project Engineer                                     : Jan. 2010 - Oct. 2010  \n";
			output += "    Helped commission over 50 primary/backup television channel pairs at      \n";
			output += "    DirecTV in Los Angeles and 48 primary/backup television channel pairs at  \n";
			output += "    Starz Entertainment in Denver; Responsible for iTX software upgrades,     \n";
			output += "    installation, and beta testing; Debugged software issues at multiple      \n";
			output += "    sites, including Encompass Media Group, DirecTV, Starz Entertainment, E!  \n";
			output += "    Entertainment, and Turner Broadcasting; Ran database audits in Microsoft  \n";
			output += "    SQL Server 2008; Wrote custom batch scripts for log analysis, remote file \n";
			output += "    updates, and file system audits; Worked primarily in Windows 2008 Servers.";

			break;
		case 'projects':
			output += "------------------------------------------------------------------------------\n";
			output += "Projects\n";
			output += "------------------------------------------------------------------------------\n";
			output += "Bistro                                               : Mar. 2013 - Present    \n";
			output += "    Bistro is a restaurant ratings and comment aggregator built on top of the \n";
			output += "    CodeIgniter framework and MongoDB; Bistro currently pulls data from Yelp, \n";
			output += "    TripAdvisor, OpenTable, CityGrid, Facebook, Instagram, Foursquare,        \n";
			output += "    Twitter, and Google using both API implementations, as well as stealth    \n";
			output += "    crawlers utilizing the Tor network; Currently in development.\n\n";

			output += "Towntrack                                            : Oct. 2011 - Oct. 2012  \n";
			output += "    Towntrack was originally developed as a way to give unsigned and indie    \n";
			output += "    artists an unbiased and uncompetitive way to receive more exposure;       \n";
			output += "    Towntrack pulled artist data and music from Facebook and SoundCloud,      \n";
			output += "    allowing the catalog to grow quickly, and gave artists a powerful backend \n";
			output += "    interface to track plays, skips, likes, and dislikes; Data from Next Big  \n";
			output += "    Sound was also aggregated, to give artists an even more complete picture  \n";
			output += "    of their online presence; Built on CodeIgniter and MySQL; Towntrack       \n";
			output += "    development was discontinued due to lack of funding, however the website  \n";
			output += "    is still available at www.towntrack.net.";

			break;
		default:
			break;
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
	socket.write(" ______           _                        _____ _\n"); 
	socket.write("|___  /          | |                      |  ___| |\n");
	socket.write("   / /  __ _  ___| |__   __ _ _ __ _   _  | |_  | | _____      _____ _ __\n"); 
	socket.write("  / /  / _` |/ __| '_ \\ / _` | '__| | | | |  _| | |/ _ \\ \\ /\\ / / _ \\ '__|\n");
	socket.write("./ /__| (_| | (__| | | | (_| | |  | |_| | | |   | | (_) \\ V  V /  __/ |\n");
	socket.write("\\_____/\\__,_|\\___|_| |_|\\__,_|_|   \\__, | \\_|   |_|\\___/ \\_/\\_/ \\___|_|\n");
	socket.write("                                    __/ |\n");
	socket.write("                                   |___/\n\n");
	sendData(socket, "Type 'help' for more information.");

	socket.on('data', function(data) {
		receiveData(socket, data);
	})

	socket.on('end', function() {
		closeSocket(socket);
	})
}
 
var server = net.createServer(newSocket);
server.listen(config.port);
