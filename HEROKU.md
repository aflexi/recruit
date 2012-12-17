README for Heroku Deployment
============================

Basically...
------------

Please read the Heroku's [NodeJS guide](https://devcenter.heroku.com/articles/nodejs) before you start. Then, configure
the app to use the NodeJS [buildpack](https://devcenter.heroku.com/articles/buildpacks):

    heroku config:add BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-nodejs
