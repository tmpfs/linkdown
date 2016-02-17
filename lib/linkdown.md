$0
==

Link manipulation tool.

## Commands

* `info: info, i`: Print response information.
* `list: list, ls`: Print discovered links.
* `validate: validate, v`: Validate (X)HTML pages (nu validator).

## Options

* `bail: --bail`: Exit on first non-2xx response code.
* `conf: -c, --conf=[file...]`: Load crawler configuration files.
* `logLevel: --log-level=[level]`: Set the log level.
* `json: --json`: Output as JSON where possible.
* `depth: --depth=[int]`: Maximum depth to recurse.
* `report: --report=[file]`: Write statistics report to file.
* `output: -o, --output=[file]`: Pipe stdout to file.

### Info

If the `--json` option is given the item data is printed to stdout as line-delimited JSON documents. If a buffer is available for the item (it has been downloaded) the buffer length is injected as a `length` field.

### List

If the `--json` option is given the links are printed to stdout as line-delimited JSON documents with the fields `url` and `resources`.

### Validate

#### Options

* `format: --format=[fmt]`: Validator output format.
* `jar: --jar=[file]`: Path to the validator jar file.
* `errorsOnly: --errors-only`: Warnings and info messages are not reported.
* `abort: --abort`: Abort validation on the first error.

This command will fetch all pages ending with the `.htm`, `.html`, `.xhtml` and `.xht` extensions; URLs with no file extension are assumed to be directories serving (X)HTML pages. Each downloaded file is written to a temporary file and passed to the validator.

To use this command you must have java(1) installed (version 8 is recommended) and specify the path to the nu validator jar by setting `--jar` or the environment variable `NU_VALIDATOR_JAR`. 

If the server responds with a MIME type other than `text/html` or `application/xhtml+xml` validation is skipped and a warning is printed.

Without the `--format` option the format is set to `json`; the response document is parsed and printed to stderr.

When the `--format` option is given the raw validator output is printed to stdout, the first line is the remote URL, followed by the validator output followed by a newline.

Because all log messages are sent to stderr this means you can get an easy to parse log file with all validation results using `linkdown v --format json http://example.com > validation.log`.

If the `--json` option is given all validation results are output to stdout as line-delimited JSON documents with the fields `url` and `result`.

To pass additional arguments to the java executable use `--`, for example: `linkdown v http://example.com -- -Xss512k` to adjust the java thread stack size.

## Redirects

Redirects are automatically followed provided the redirect is to the same host.

## Report

When the `--report` option is given statistics are written to the specified file as a JSON document when the crawl is complete, it has the following fields:

* `length`: Number of items in the queue.
* `complete`: Number of items completed.
* `errors`: Number of requests that responded with 4xx or 5xx status codes.
* `stats`: An object containing statistics.

The stats object has child objects that contain `min`, `max` and `avg` statistics for each of the following fields:

* `headers`: Time in milliseconds until response headers were received.
* `body`: Time in milliseconds to download the response body.
* `request`: Time in milliseconds to download the entire response; headers and body.
* `size`: Size in bytes for the response body.

## Signals

You may pause the crawl by sending the signal `TSTP` and resume a paused crawl by sending the signal `CONT`.

Attempting to send the `TSTP` signal on a paused crawl will have no effect as will attempting to send `CONT` when the crawl has not previously been paused with `TSTP`.

Note that depending upon the concurrency level you may see messages printed after a crawl is paused.

## Exit

The program will exit with a non-zero exit code when an error is encountered. When the crawl completes any 4xx and 5xx HTTP response codes will cause the program to exit with code 255. This guarantees that a success exit code of zero will only occur when the crawl completes and no HTTP error responses occurred.

## See

signal(7)
