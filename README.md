recruit
=======

Setup
-----

You probably want to have [nvm](https://github.com/creationix/nvm) and [npm](https://github.com/creationix/nvm) set up.

Then:

    nvm use <node_version>
    npm install

Run locally with [Foreman](https://devcenter.heroku.com/articles/nodejs#declare-process-types-with-procfile), e.g.

    export TO=hr@email.com SMTP_USER=user SMTP_PASS=pass && foreman start
