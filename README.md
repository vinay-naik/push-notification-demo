# Push Notification Demo

<h2>This is a demo project created with an intention lo learn more about websockets.</h2>
<h4>Github repo : https://github.com/vinay-naik/push-notification-demo</h4>

<strong>STEPS TO SETUP THE PROJECT : </strong><br>
1 : Extract the project folder.<br>
2 : Make sure that you have node v-7 installed on your system.  <br>
	<pre>
		- curl -sL https://deb.nodesource.com/setup_7.x | bash - <br>
		- apt-get install -y nodejs <br>
		- sudo ln -s /usr/bin/nodejs /usr/bin/node  //this is to access nodejs as just node <br>
	</pre>
3 : Make sure that you have mongodb installed on your system. Follow the directions on <br>
	<pre>
		- https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
	</pre>
4 : In the project folder install the node modules <br>
	<pre>
		- npm install
	</pre>
5 : Now launch the node server from the project root <br>
	<pre>
		- node server/server.js
	</pre>
6 : In the browser open <br>
	<pre>
		- http://localhost:3000/login
	</pre>
7 : You can change the database name in the config file present in server/config/index.js <br>
	<pre>
		- default name is notify-test-db
	</pre>
8 : You can change the port number in the config file present in server/config/index.js <br>
	<pre>
		- default port is 3000 <br>
		- NOTE : Please ensure that if you change the port number or not running the node server on localhost then update the same in client/public/dashboard.js line:180. We need to ensure that frontend is listening to the socket server fopr push notifications to work. <br>
	</pre>			 

<br>
<br>
<strong>SYSTEM USED FOR TESTING : Ubuntu 16.04</strong>
