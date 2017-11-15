# Push Notification Demo

This is a demo project created with an intention lo learn more about websockets.
Github repo : https://github.com/vinay-naik/push-notification-demo

STEPS TO SETUP THE PROJECT : 
1 : Extract the project folder.
2 : Make sure that you have node v-7 installed on your system.  
	- curl -sL https://deb.nodesource.com/setup_7.x | bash -
	- apt-get install -y nodejs
	- sudo ln -s /usr/bin/nodejs /usr/bin/node  //this is to access nodejs as just node
3 : Make sure that you have mongodb installed on your system. Follow the directions on 
	- https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
4 : In the project folder install the node modules
	- npm install
5 : Now launch the node server from the project root
	- node server/server.js
6 : In the browser open 
	- http://localhost:3000/login
7 : You can change the database name in the config file present in server/config/index.js
	- default name is notify-test-db
8 : You can change the port number in the config file present in server/config/index.js
	- default port is 3000
	- NOTE : Please ensure that if you change the port number or not running the node server on localhost then update the same in client/public/dashboard.js line:180. 
			 We need to ensure that frontend is listening to the socket server fopr push notifications to work. 


SYSTEM USED FOR TESTING : Ubuntu 16.04