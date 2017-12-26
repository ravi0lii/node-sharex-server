# node-sharex-server
- [What is this](#what-is-this)
- [Installation](#installation)
- [Configuration](#configuration)
- [ShareX client configuration](#sharex-client-configuration)
- [Screenshots](#screenshots)
- [License](#license)  

# What is this
node-sharex-server is a [ShareX](https://getsharex.com) upload server which is easy to setup and to use. Currently node-sharex-server provides the following features:
* File-sharing:
    * Uploading files (also images)
    * Allowing only configured file extensions (for more safety)

# Installation
**NOTE:** You need git (to clone this repo) and nodejs (with npm) to run this program.  
First we have to clone this repo. You can do that by typing `git clone git@github.com:Moquo/node-sharex-server.git` (for ssh) or `git clone https://github.com/Moquo/node-sharex-server.git` (for https). After going into the directory, we have to install the dependencies. Type `npm install` to do so. You can start node-sharex-server now by typing `node app.js`. You could use e.g. pm2 to run node-sharex-server in the background. Environment variables:
* `PORT`: The port which is used by the web server
