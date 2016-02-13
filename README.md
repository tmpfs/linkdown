Table of Contents
=================

* [Linkdown](#linkdown)
  * [Install](#install)
  * [Manual](#manual)
  * [Usage](#usage)
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Lint](#lint)
    * [Clean](#clean)
    * [Readme](#readme)
  * [License](#license)

Linkdown
========

Link manipulation tool.

## Install

```
npm i -g linkdown
```

## Manual

Run `linkdown help` for the program manual, use `linkdown help <cmd>` for individual command man pages.

## Usage

```
Usage: linkdown <command>

where <command> is one of:
    help, info, i

linkdown@1.0.0 /home/muji/git/linkdown
```

## Developer

### Test

To run the test suite:

```
npm test
```

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

[jshint]: http://jshint.com
[jscs]: http://jscs.info
