Table of Contents
=================

* [Linkdown](#linkdown)
  * [Install](#install)
  * [Usage](#usage)
  * [Manual](#manual)
  * [Guide](#guide)
  * [Guide](#guide-1)
    * [Configuration](#configuration)
    * [Info](#info)
    * [Validate](#validate)
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Lint](#lint)
    * [Clean](#clean)
    * [Readme](#readme)
  * [License](#license)

Linkdown
========

[<img src="https://travis-ci.org/tmpfs/linkdown.svg?v=2" alt="Build Status">](https://travis-ci.org/tmpfs/linkdown)
[<img src="http://img.shields.io/npm/v/linkdown.svg?v=2" alt="npm version">](https://npmjs.org/package/linkdown)
[<img src="https://coveralls.io/repos/tmpfs/linkdown/badge.svg?branch=master&service=github&v=3" alt="Coverage Status">](https://coveralls.io/github/tmpfs/linkdown?branch=master).

Link manipulation tool designed for POSIX systems.

Crawl a URL, find all links and operate on the links.

Designed to be used to:

* Validate all HTML pages on a website.
* Generate a site map from a website structure.
* Print link information to find broken links.

But may be used to perform arbitrary operations on the links crawled from a domain.

## Install

```
npm i -g linkdown
```

## Usage

```
Usage: linkdown <command>

where <command> is one of:
    help, info, i, validate, v

linkdown@1.0.3 /home/muji/git/linkdown
```

## Manual

Run `linkdown help` for the program manual, use `linkdown help <cmd>` for individual command man pages. You can view quick help on commands and options with `linkdown -h` or `linkdown -help`.

## Guide

## Guide

### Configuration

The [default configuration](https://github.com/tmpfs/linkdown/blob/master/linkdown.js) file is always loaded, you can load your own configuration file(s) which will be merged with the default. Configuration files should be javascript, for example:

```
linkdown info http://example.com -c /path/to/conf.js -c /path/to/other/conf.js
```

### Info

Print link status codes, URLs and buffer lengths.

```shell
linkdown info http://example.com
```

<pre><code></span></span><span style="color:#209805;"> INFO<span style="font-weight:normal;opacity:1;color:#fff;background:#000;"><span style="color:#00ffee;"> |</span></span></span> </span><span style="color:#209805;">200<span style="font-weight:normal;opacity:1;color:#fff;background:#000;"></span></span> </span>http://example.com/<span style="font-weight:normal;opacity:1;color:#fff;background:#000;"></span> (</span>[1;39m1270<span style="font-weight:normal;opacity:1;color:#fff;background:#000;"></span></span> bytes)<span style="font-weight:normal;opacity:1;color:#fff;background:#000;">
</span></code></pre>

### Validate

Validate all HTML pages on a website using the [nu validator](https://github.com/validator/validator).

To use this command you should have Java 1.8 installed and [download the validator](https://github.com/validator/validator/releases) jar file. This command was tested using `v16.1.1`.

You can use the `--jar` option to specify the path to the jar file but it is recommended you set the environment variable `NU_VALIDATOR_JAR` so that there is no need to keep specifying on the command line.

When the validate command encounters errors they are printed to screen in a format that enables easily debugging and fixing the errors much like the online w3 validation service.

```shell
linkdown validate http://example.com
```

<pre><code></span></span><span style="color:#209805;"> INFO<span style="font-weight:normal;opacity:1;color:#fff;background:#000;"><span style="color:#00ffee;"> |</span></span></span> </span><span style="color:#209805;">200<span style="font-weight:normal;opacity:1;color:#fff;background:#000;"></span></span> </span>http://example.com/<span style="font-weight:normal;opacity:1;color:#fff;background:#000;"></span> (</span>[1;39m1270<span style="font-weight:normal;opacity:1;color:#fff;background:#000;"></span></span> bytes)<span style="font-weight:normal;opacity:1;color:#fff;background:#000;">
</span></span><span style="color:#209805;"> INFO<span style="font-weight:normal;opacity:1;color:#fff;background:#000;"><span style="color:#00ffee;"> |</span></span></span> validation passed <span style="color:#209805;">http://example.com/<span style="font-weight:normal;opacity:1;color:#fff;background:#000;"></span><span style="font-weight:normal;opacity:1;color:#fff;background:#000;">
</span></span></code></pre>

## Developer

### Test

To run the test suite:

```
npm test
```

* `PORT`: Port for the mock web server, default `8080`.
* `URL`: URL for the mock web server, default `http://localhost:8080`.
* `DEBUG`: When set do not suppress program output.

### Cover

To generate code coverage run:

```
npm run cover
```

### Lint

Run the source tree through [jshint](http://jshint.com) and [jscs](http://jscs.info):

```
npm run lint
```

### Clean

Remove generated files:

```
npm run clean
```

### Readme

To build the readme file from the partial definitions:

```
npm run readme
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/tmpfs/linkdown/blob/master/LICENSE) if you feel inclined.

Generated by [mdp(1)](https://github.com/tmpfs/mdp).

[validator]: https://github.com/validator/validator
[validator-releases]: https://github.com/validator/validator/releases
[simplecrawler]: https://github.com/cgiffard/node-simplecrawler
[jshint]: http://jshint.com
[jscs]: http://jscs.info
