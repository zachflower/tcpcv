/*
 * Config Variables
 */

var config = {
	port: 2468,
	motd: 'ZacharyFlower',
	sections: {
		info: {
			title: 'Info',
			description: 'Personal information',
			data: [
				"Name: Zachary M. Flower",
				"Email: zach@zacharyflower.com",
				"Website: http://zacharyflower.com",
				"Twitter: @zachflower"
			]
		},
		education: {
			title: 'Education',
			description: 'Education history',
			data: [
				{
					header: [
						"University of Colorado at Boulder",
						"Boulder, CO"
					],
					subheader: [
						"B.S. in Computer Science",
						"Fall 2005 - Spring 2010"
					]
				}
			]
		},
		employment: {
			title: 'Employment',
			description: 'Employment history',
			data: [
				{
					header: [
						"Buffer",
						"San Francisco, CA"
					],
					subheader: [
						"Backend Hacker",
						"Jan. 2014 - May 2014"
					],
					body: "Full-time work-from-home position; Developed in PHP; Developed on top of a highly modified CodeIgniter framework; Developed RSS feed importing feature; Made various updates and bug fixes to the Buffer API and web app; Implemented multiple security features, including user session management, multiple failed login lockouts, and API token management; Implemented real-time Twitter analytics tracking and semi-real-time Facebook, Linkedin, and Google+ analytics tracking; Made numerous improvements to analytics tracking and reporting functionality; Introduced New Relic monitoring; Worked on top of Amazon AWS stack utilizing SQS, EC2, S3, and  Elastic Beanstalk; Worked directly with customers to solve more technical  issues."
				},
				{
					header: [
						"Mocavo, Inc.",
						"Boulder, CO"
					],
					subheader: [
						"Senior Backend Software Developer",
						"Aug. 2011 - Aug. 2013"
					],
					body: "Developed in PHP; Developed on top of a highly modified CodeIgniter framework; Wrote various crawlers for gathering data from Google, Ancestry.com, and Archives.com, among others; Designed and implemented a natural language processing system to bring structure to unstructured search results, allowing users to run sophisticated queries based on location, date ranges, first name alternates, similar last names, and events; Implemented order system using BrainTree Gateway; Developed RESTful API for Mocavo mobile apps; Implemented standalone OCR system; Developed automatic search service, allowing users to upload family trees and have search results based on multiple algorithms mailed to them weekly; Integrated several third party APIs (Dropbox, Geni, BrainTree); Built and maintained extensive administrative tools for support staff; Developed backend for custom family tree builder; Created word-highlighting thumbnail generator using OCR word coordinates."
				},
				{
					header: [
						"Name.com",
						"Denver, CO"
					],
					subheader: [
						"Software Developer",
						"Oct. 2010 - Aug. 2011"
					],
					body: "Developed in PHP; Developed on top of a highly modified CodeIgniter framework; Designed and developed the first version of Name.com’s mobile website; Implemented various ccTLDs (.BE, .LI, .CH); Responsible for all domain name transfer functionality; Developed RESTful API for Name.com sister site, Who.is; Integrated numerous third party APIs for use  the Name.com website (Tropo, DevHub, MobileView, DIYSEO); Implemented Unofficial API for integration with About.me; Lead developer on various product implementations (PageZen and SEOTutor)."
				},
				{
					header: [
						"Omnibus Systems",
						"Golden, CO"
					],
					subheader: [
						"Project Engineer",
						"Jan. 2010 - Oct. 2010"
					],
					body: "Helped commission over 50 primary/backup television channel pairs at DirecTV in Los Angeles and 48 primary/backup television channel pairs at Starz Entertainment in Denver; Responsible for iTX software upgrades, installation, and beta testing; Debugged software issues at multiple sites, including Encompass Media Group, DirecTV, Starz Entertainment, E! Entertainment, and Turner Broadcasting; Ran database audits in Microsoft SQL Server 2008; Wrote custom batch scripts for log analysis, remote file updates, and file system audits; Worked primarily in Windows 2008 Servers."
				}
			]
		},
		achievements: {
			title: 'Achievements',
			description: 'Awards & achievements',
			data: [
				{
					header: [
						"Broadcast Engineering Magazine Excellence Award",
						"Fall 2010"
					],
					body: "Design Team Project Engineer"
				},
				{
					header: [
						"CI Engineering Design Expo Project Award",
						"Spring 2010"
					],
					body: "Computer Science Capstone Awarded \"Best in Section\""
				},
				{
					header: [
						"Competed in Imagine Cup Regional Semi-Finals",
						"Spring 2007"
					],
					body: "Imagine Cup is a Programming Competition hosted by Microsoft"
				}
			]
		},
		projects: {
			title: 'Projects',
			description: 'Personal projects',
			data: [
				{
					header: [
						"Bistro",
						"Mar. 2013 - Present"
					],
					body: "Bistro is a restaurant ratings and comment aggregator built on top of the CodeIgniter framework and MongoDB; Bistro currently pulls data from Yelp, TripAdvisor, OpenTable, CityGrid, Facebook, Instagram, Foursquare, Twitter, and Google using both API implementations, as well as stealth crawlers utilizing the Tor network; Currently in development."
				},
				{
					header: [
						"Towntrack",
						"Oct. 2011 - Oct. 2012"
					],
					body: "Towntrack was originally developed as a way to give unsigned and indie artists an unbiased and uncompetitive way to receive more exposure; Towntrack pulled artist data and music from Facebook and SoundCloud, allowing the catalog to grow quickly, and gave artists a powerful backend interface to track plays, skips, likes, and dislikes; Data from Next Big Sound was also aggregated, to give artists an even more complete picture of their online presence; Built on CodeIgniter and MySQL; Towntrack development was discontinued due to lack of funding, however the website is still available at www.towntrack.net."
				}
			]
		}
	}
};

module.exports = config;