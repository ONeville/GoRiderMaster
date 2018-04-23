##Issue: Ionic 2: Cordova is not available. Make sure to include cordova.js or run in a device/simulator (running in emulator)

##Fix: You need go to node_modules/@ionic/app-scripts/dist/dev-server/serve-config.js and replace
exports.IOS_PLATFORM_PATH = path.join('platforms', 'ios', 'app', 'src', 'main', 'assets', 'www');
exports.ANDROID_PLATFORM_PATH = path.join('platforms', 'android', 'app', 'src', 'main', 'assets', 'www');


### ionic cordova run browser
