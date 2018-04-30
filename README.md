The project description for `Fish360` app can be found at :

https://docs.google.com/document/d/1iyJGMfHFBoXA_qdo9V3w1S8rcX7yrOUaH9G4JOxRDYA/edit?ts=5ae11b2d

The OpenShift `nodejs` cartridge documentation can be found at:

https://github.com/openshift/origin-server/tree/master/cartridges/openshift-origin-cartridge-nodejs/README.md

### Local 
1. Install [heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Add ".env" file in the project root directory "Journal"
```
ADMIN_PASSWORD=
ADMIN_USERNAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_URL=
MONGODB_URI=
```
3. All the above config properties can be accessed from heroku. in the command line type. (Make sure you have logged into the fish 360 app using heroku CLI).
```$ heroku config```
