# node-sharex-server
- [What is this](#what-is-this)
- [Installation](#installation)
- [Configuration](#configuration)
- [ShareX client configuration](#sharex-client-configuration)
- [License](#license)  

# What is this
node-sharex-server is a [ShareX](https://getsharex.com) upload server which is easy to setup and to use. Currently node-sharex-server provides the following features:
* File-sharing:
    * Uploading files (also images)
    * Allowing only configured file extensions (for more safety)

# Installation
**NOTE:** You need git (to clone this repo) and nodejs (with npm) to run this program.  
First we have to clone this repo. You can do that by typing `git clone git@github.com:ravi0lii/node-sharex-server.git` (for ssh) or `git clone https://github.com/ravi0lii/node-sharex-server.git` (for https). After going into the directory, we have to install the dependencies. Type `npm install` to do so. You can start node-sharex-server now by typing `node app.js`. You could use e.g. pm2 to run node-sharex-server in the background.

# Configuration
**NOTE:** To make changes effective, you have to restart the server!  
You can configure the server in the `config.json` file. Options:
* `port`: The port the server should listen on.
* `keys`: You can add keys (authentication tokens) here.
* `fileSizeLimit`: You can set the file size limit (in bytes) here. Example: You want to set the limit to 100 mb. That means we have to change the value to 100 (MB) \* 1024 (kB) \* 1024 (B) = 104857600 (B).
* `fileNameLength`: The length of the generated file names.
* `useLocalStaticServe`: Use the express.static middleware to serve the uploaded files.
* `staticFileServerUrl`: The url that should be sent to the ShareX client.
* `serverUrl`: The url where you can reach the server without the finalizing slash (/).
* `uploadDirectory`: The directory that should be used for saving the files.
* `ssl`: SSL-related options
    * `useSSL`:
    * `privateKeyPath`: The path to the ssl private key.
    * `certificatePath`: The path to the ssl certificate.
* `fileExtensionCheck`: Check the extension of uploaded files
    * `enabled`: Is this feature enabled?
    * `extensionsAllowed`: The extensions which are whitelisted (if the feature is enabled).

# ShareX client configuration
**NOTE:** Replace *UPLOADER\_NAME*, *SERVER\_URL* and *YOUR\_KEY* with your own values!
```json
{
    "Name": "UPLOADER_NAME",
    "DestinationType": "ImageUploader, FileUploader",
    "RequestType": "POST",
    "RequestURL": "SERVER_URL/upload",
    "FileFormName": "file",
    "Arguments": {
        "key": "YOUR_KEY"
    },
    "ResponseType": "Text",
    "URL": "$json:file.url$",
    "ThumbnailURL": "",
    "DeletionURL": "$json:file.delete_url$"
}
```

# License
[MIT](/LICENSE)
