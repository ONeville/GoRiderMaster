'AIzaSyBQJa3dR7IhkvYow9ub4XV6rV5cbqMGRQc'

https://www.youtube.com/watch?v=Z3HdOTQ8YHI&index=1&list=PLxabZQCAe5fgXx8cn2iKOtt0VFJrf5bOd

### RUN On Emulator

1. ionic cordova platform add android
2. ionic cordova run  android --livereload

  ###  1. Update Java_HOMO env
  ###  2. edit emulator.js 
            From platforms\cordova\lib
                    avd.target = 'Android ' + (level ? level.semver : '') + ' (API level ' + api_level + ')';

  ###  3. Add in Config.xml
        <preference name="loadUrlTimeoutValue" value="700000" />
    

https://angularfirebase.com/lessons/geofire-location-queries-with-google-maps/

https://github.com/firebase/geofire-js/tree/master/examples