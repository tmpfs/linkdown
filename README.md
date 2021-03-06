Table of Contents
=================

* [Linkdown](#linkdown)
  * [Install](#install)
  * [Usage](#usage)
  * [Manual](#manual)
  * [Guide](#guide)
    * [Configuration](#configuration)
    * [Info](#info)
    * [List](#list)
    * [Exec](#exec)
    * [Meta](#meta)
    * [Tree](#tree)
    * [Validate](#validate)
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Lint](#lint)
    * [Clean](#clean)
    * [Readme](#readme)
    * [Manual](#manual-1)
    * [Server](#server)
  * [Credits](#credits)
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

In the future it will also:

* Generate a static cache for dynamic web applications.
* Download files of a certain type from a website.
* Cache an entire website for offline browsing.

## Install

```
npm i -g linkdown
```

The executable is named `linkdown` but is also available as `ldn` for those that prefer less typing.

## Usage

```
Usage: linkdown <command>

where <command> is one of:
    exec, x, help, info, i, list, ls, meta, m, tree, t,
    validate, v

linkdown@1.1.1 /home/muji/git/linkdown
```

## Manual

Run `linkdown help` for the program manual, use `linkdown help <cmd>` for individual command man pages. You can view quick help on commands and options with `-h | --help`.

## Guide

This section provides examples on how to use the program, for more detailed information see the relevant man entry: `linkdown help <cmd>`.

### Configuration

The [default configuration](https://github.com/tmpfs/linkdown/blob/master/linkdown.js) file is always loaded, you can load your own configuration file(s) which will be merged with the default. Configuration files should be javascript, for example:

```
linkdown info http://example.com -c /path/to/conf.js -c /path/to/other/conf.js
```

The `crawl` section of the configuration file supports all the configuration properties defined by [simplecrawler](https://github.com/cgiffard/node-simplecrawler).

### Info

Print link status codes, URLs and buffer lengths.

```shell
linkdown info http://localhost:8000 --bail
```

```
 INFO | [4318] started on Tue Feb 23 2016 15:10:45 GMT+0800 (WITA)
 INFO | 200 http://localhost:8000/ (745 B)
 WARN | 404 http://localhost:8000/style.css
ERROR | bailed on 404 http://localhost:8000/style.css
```

### List

List discovered resources (URLs) for each crawled page.

```shell
linkdown ls http://localhost:8000 --bail
```

```
 INFO | [4360] started on Tue Feb 23 2016 15:10:46 GMT+0800 (WITA)
 INFO | 200 http://localhost:8000/ (745 B)
 INFO | URL http://localhost:8000/style.css
 INFO | URL http://localhost:8000/redirect
 INFO | URL http://localhost:8000/meta
 INFO | URL http://localhost:8000/into/the/deep
 INFO | URL http://localhost:8000/section?var=val
 INFO | URL http://localhost:8000/text
 INFO | URL http://localhost:8000/validate-fail
 INFO | URL http://localhost:8000/validate-warn
 INFO | URL http://localhost:8000/validate-error
 INFO | URL http://localhost:8000/bad-length
 INFO | URL http://localhost:8000/non-existent
 WARN | 404 http://localhost:8000/style.css
ERROR | bailed on 404 http://localhost:8000/style.css
```

### Exec

Execute a program for each fetched resource; the buffer for each resource is written to stdin of the spawned program.

```shell
linkdown exec http://localhost:8000/meta --cmd grep -- meta
```

```
 INFO | [4369] started on Tue Feb 23 2016 15:10:47 GMT+0800 (WITA)
 INFO | 200 http://localhost:8000/meta (322 B)
    <meta charset="utf-8">
    <meta name="description" content="Meta Test">
    <meta name="keywords" content="meta, link, http, linkdown">
 WARN | 404 http://localhost:8000/style.css
 INFO | HEAD Min: 44ms, Max: 46ms, Avg: 45ms
 INFO | BODY Min: 5ms, Max: 5ms, Avg: 5ms
 INFO | TIME Min: 44ms, Max: 51ms, Avg: 48ms
 INFO | SIZE Min: 322 B, Max: 322 B, Avg: 322 B
 INFO | HTTP Total: 2, Complete: 2, Errors: 1
```

### Meta

Reads an HTML page written to stdin and prints a JSON document; designed to be used with the `exec` command to inject meta data as pages are fetched.

```shell
linkdown exec http://localhost:8000/meta --cmd linkdown -- meta
```

```
 INFO | [4408] started on Tue Feb 23 2016 15:10:48 GMT+0800 (WITA)
 INFO | 200 http://localhost:8000/meta (322 B)
 WARN | 404 http://localhost:8000/style.css
{"meta":{"title":"Meta Page","description":"Meta Test","keywords":"meta, link, http, linkdown"}}
 INFO | HEAD Min: 26ms, Max: 31ms, Avg: 29ms
 INFO | BODY Min: 4ms, Max: 4ms, Avg: 4ms
 INFO | TIME Min: 30ms, Max: 31ms, Avg: 31ms
 INFO | SIZE Min: 322 B, Max: 322 B, Avg: 322 B
 INFO | HTTP Total: 2, Complete: 2, Errors: 1
```

```shell
linkdown exec http://localhost:8000/meta --cmd linkdown --json -- meta
```

```
 INFO | [4426] started on Tue Feb 23 2016 15:10:49 GMT+0800 (WITA)
 INFO | 200 http://localhost:8000/meta (322 B)
 WARN | 404 http://localhost:8000/style.css
{"url":"http://localhost:8000/meta","protocol":"http","host":"localhost","port":8000,"path":"/meta","depth":1,"fetched":true,"status":"downloaded","stateData":{"requestLatency":37,"requestTime":40,"contentLength":322,"contentType":"text/html; charset=utf-8","code":200,"headers":{"content-type":"text/html; charset=utf-8","content-length":"322","etag":"W/\"142-yIHzsRL5RxIRsAAxctYrsw\"","date":"Tue, 23 Feb 2016 07:10:49 GMT","connection":"close"},"downloadTime":3,"actualDataSize":322,"sentIncorrectSize":false},"meta":{"title":"Meta Page","description":"Meta Test","keywords":"meta, link, http, linkdown"}}
 INFO | HEAD Min: 24ms, Max: 37ms, Avg: 31ms
 INFO | BODY Min: 3ms, Max: 3ms, Avg: 3ms
 INFO | TIME Min: 24ms, Max: 40ms, Avg: 32ms
 INFO | SIZE Min: 322 B, Max: 322 B, Avg: 322 B
 INFO | HTTP Total: 2, Complete: 2, Errors: 1
```

### Tree

Reads line-delimited JSON records written to stdin and converts to a tree structure, designed to be used after meta data has been injected so that a site map can be generated dynamically.

Note that the resulting tree is keyed by fully qualified host name (including a port when necessary) so that it can handle the scenario when a crawl resolves to multiple hosts.

Generating a tree structure is a two stage process, first the site should be crawled and meta data injected:

```
linkdown exec --cmd 'linkdown meta' --json http://localhost:8080 > site.log.json
```

Note that the `--json` option is required to print the JSON records to stdout. Then you can generate a JSON tree with:

```
linkdown tree --indent=2 < site.log.json > site.tree.json
```

For more compact JSON do not specify `--indent`.

You can also pipe the records for a single command:

```
linkdown exec --cmd 'linkdown meta' --json http://localhost:8080 | linkdown tree > site.tree.json
```

The tree command can also print list(s) when `--list-style` is given, the list style may be one of:

* `tty`: Print the tree hierarchy suitable for display on a terminal.
* `html`: Print an HTML unordered list.
* `md`: Print a markdown list.
* `jade`: Print a list suitable for [jade](http://jade-lang.com).

For the `tty` and `md` list styles when multiple trees are generated (multiple hosts) they are delimited with a newline; for the `html` and `jade` list styles distinct lists are printed.

Sometimes it is useful to get a quick view of the tree without the injected meta data; use the `--labels` option to always use the path name for the node label, for example:

```
linkdown tree --list-style=tty --labels < site.log.json
```

### Validate

Validate all HTML pages on a website using the [nu validator](https://github.com/validator/validator).

To use this command you should have Java 1.8 installed and [download the validator](https://github.com/validator/validator/releases) jar file. This command was tested using `v16.1.1`.

You can use the `--jar` option to specify the path to the jar file but it is recommended you set the environment variable `NU_VALIDATOR_JAR` so that there is no need to keep specifying on the command line.

When the validate command encounters errors they are printed to screen in a format that enables easily fixing the errors; much like the online w3 validation service.

```shell
linkdown validate http://localhost:8000/validate-fail
```

```
 INFO | [4473] started on Tue Feb 23 2016 15:10:50 GMT+0800 (WITA)
 INFO | 200 http://localhost:8000/validate-fail (200 B)
ERROR | validation failed on http://localhost:8000/validate-fail
 HTML |  
 HTML | 1) http://localhost:8000/validate-fail
 HTML |  
 HTML | From line 1, column 164; to line 1, column 169
 HTML |  
 HTML | A numeric character reference expanded to the C1 controls range.
 HTML |  
 HTML |   ion><span>&#151;</span
 HTML | ------------^
 HTML |  
 HTML | 2) http://localhost:8000/validate-fail
 HTML |  
 HTML | From line 1, column 149; to line 1, column 157
 HTML |  
 HTML | Section lacks heading. Consider using “h2”-“h6” elements to add identifying
 HTML | headings to all sections.
 HTML |  
 HTML |   ead><body><section><span>
 HTML | ------------^
 HTML |  
 INFO | HEAD Min: 27ms, Max: 27ms, Avg: 27ms
 INFO | BODY Min: 3ms, Max: 3ms, Avg: 3ms
 INFO | TIME Min: 30ms, Max: 30ms, Avg: 30ms
 INFO | SIZE Min: 200 B, Max: 200 B, Avg: 200 B
 INFO | HTTP Total: 1, Complete: 1, Errors: 0
```

## Developer

### Test

To run the test suite you will need to have installed java and the validator jar, see [validate](#validate).

You **must** not have a HTTP server running on port `9871` as this is used to test for the server down scenario.

You **must** not have permission to write to `/sbin` - pretty standard permissions.

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

To build the readme file from the partial definitions (requires [mdp](https://github.com/tmpfs/mdp)):

```
npm run readme
```

### Manual

To build the man pages run (requires [manpage](https://github.com/cli-kit/cli-manpage)):

```
npm run manual
```

### Server

To start the mock web server run:

```
npm start
```

## Credits

None of this would be possible without the work of the developers behind the excellent [simplecrawler](https://github.com/cgiffard/node-simplecrawler).

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/tmpfs/linkdown/blob/master/LICENSE) if you feel inclined.

Generated by [mdp(1)](https://github.com/tmpfs/mdp).

[simplecrawler]: https://github.com/cgiffard/node-simplecrawler
[manpage]: https://github.com/cli-kit/cli-manpage
[mdp]: https://github.com/tmpfs/mdp
[validator]: https://github.com/validator/validator
[validator-releases]: https://github.com/validator/validator/releases
[jade]: http://jade-lang.com
[jshint]: http://jshint.com
[jscs]: http://jscs.info
