# Coder vs Themer 2

This is the HTML/AngularJS front end for the Coder vs Themer presentation in 2015.

## Preparing the environment

Make sure that you have the following package managers installed (each link points to the relevant install instructions):
* [npm installed](https://nodejs.org/)
* [Bower](http://bower.io/#install-bower)
* [Grunt](http://gruntjs.com/getting-started#installing-the-cli)

Then from the repo root, run:

```bash
bower install
grunt
```

Bower will install all the javascript libraries listed in bower.json , including angularjs, twitter bootstrap, and others.

Grunt will create a minified version of the javascript at public/bower_components/_bower.js , and a minified version of the css at public/bower_components/_bower.css . In public/index.html , only the compiled versions are included. 

## File locations

The front page is at index.html , and the angularjs that corresponds to it is at public/angular/pages/index.js . The idea is that we could have multiple pages if we wanted to, each one with its own angular file. We won't, but that's the structure. :)