# LumSites Mobile

> LumSites, the mobile way

## Quick start

> First of all, install Phonegap [following the documentation](http://docs.phonegap.com/getting-started/1-install-phonegap/cli/), and the mobile app on the step 2.

To start working on project:
- Clone the repo.
- Run `npm install`.
- Run `bower install`.
- Run `gulp`.

The default gulp task launch the desktop server, build the `www/` folder and watch the application files. 
Just go to `http://localhost:8100` to see the app running.

Then, to give a try of the mobile app in android for exemple:
- Open a new CLI, and add the needed plugins with `bash plugins.sh`
- Build the android platform using `phonegap build android`.
- Run `phonegap serve` to launch the remote server.
- Launch the Phonegap application previously installed in your mobile.
- Connect to your remote server on the url provided when you launched `phonegap serve`.

You can now work on the `app` folder, both desktop and remote server will refresh your application instantly !