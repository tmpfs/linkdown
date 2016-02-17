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

Run the source tree through [jshint][] and [jscs][]:

```
npm run lint
```

### Clean

Remove generated files:

```
npm run clean
```

### Readme

To build the readme file from the partial definitions (requires [mdp][]):

```
npm run readme
```

### Manual

To build the man pages run (requires [manpage][]):

```
npm run manual
```

### Server

To start the mock web server run:

```
npm start
```
