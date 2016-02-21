$0
==

Link manipulation tool.

## Commands

* `info: info, i`: Print response information.
* `list: list, ls`: Print discovered links.
* `validate: validate, v`: Validate (X)HTML pages (nu validator).
* `exec: exec, x`: Run an executable for each response.
* `meta: meta, m`: Extract meta data from HTML pages.
* `tree: tree, t`: Convert line-delimited JSON records to a tree.

## Options

* `bail: --bail`: Exit on first non-2xx response code.
* `conf: -c, --conf [file...]`: Load crawler configuration files.
* `logLevel: --log-level [level]`: Set the log level.
* `json: -j, --json`: Output as JSON where possible.
* `depth: --depth [int]`: Maximum depth to recurse.
* `report: --report [file]`: Write statistics report to file.
* `output: -o, --output [file]`: Print to file not stdout.
* `pid: --pid [file]`: Write process id to file.

### Info

If the `--json` option is given the item data is printed to stdout as line-delimited JSON documents. If a buffer is available for the item (it has been downloaded) the buffer length is injected as a `length` field.

### List

If the `--json` option is given the links are printed to stdout as line-delimited JSON documents with the fields `url` and `resources`.

### Validate

#### Options

* `format: --format [fmt]`: Validator output format.
* `jar: --jar [file]`: Path to the validator jar file.
* `errorsOnly: --errors-only`: Warnings and info messages are not reported.
* `abort: --abort`: Abort validation on the first error.

This command will fetch all pages ending with the `.htm`, `.html`, `.xhtml` and `.xht` extensions; URLs with no file extension are assumed to be directories serving (X)HTML pages. Each downloaded file is written to a temporary file and passed to the validator.

To use this command you must have java(1) installed (version 8 is recommended) and specify the path to the nu validator jar by setting --jar or the environment variable NU_VALIDATOR_JAR.

If the server responds with a MIME type other than `text/html` or `application/xhtml+xml` validation is skipped and a warning is printed.

Without the --format option the format is set to `json`; the response document is parsed and printed to stderr.

When the --format option is given the raw validator output is printed to stdout, the first line is the remote URL, followed by the validator output followed by a newline.

Because all log messages are sent to stderr this means you can get an easy to parse log file with all validation results using `linkdown v --format json http://example.com > validation.log`.

If the --json option is given all validation results are output to stdout as line-delimited JSON documents with the fields `url` and `result`.

To pass additional arguments to the java executable use --, for example: `linkdown v http://example.com -- -Xss512k` to adjust the java thread stack size.

### Exec

For each fetched resource execute the program specified by `--cmd`. The downloaded buffer for the resource is written to stdin of the child process.

#### Options

* `cmd: --cmd=[exe]`: The program to execute.

#### Arguments

If the --cmd option contains whitespace it is split into an array and the command is taken from the first element in the array the remaining parts are treated as arguments to the command. When -- is specified remaining arguments are concatenated with any current arguments. Thus:

$0 exec --cmd 'echo foo' http://localhost:8080 -- bar

Will result in `foo bar` being printed.

When the --json option is present the current queue item is stringified and sent as an additional argument to the child process.

### Meta

The meta command extracts HTML page meta data from a buffer written to stdin. It extracts the value from the <title> element and any <meta> tags in the input buffer.

Typically this is used in combination with the exec command.

It prints to stdout a JSON document containing the meta data. When a JSON document is passed as an argument the meta data is injected into the input document.

#### Example

Without the --json option to the exec command a simple document is printed.

```
$0 exec http://localhost:8080/meta --cmd 'ldn meta'
```

Outputs:

```
{
  "meta": {
    "title": "Meta Page",
    "description": "Meta Test",
    "keywords": "meta, link, http, linkdown"
  }
}
```

When the --json option is given to exec a more complete document is printed.

```
$0 exec http://localhost:8080/meta --cmd 'ldn meta' --json
```

Outputs:

```
{
  "url": "http://localhost:8080/meta",
  "protocol": "http",
  "host": "localhost",
  "port": 8080,
  "path": "/meta",
  "depth": 1,
  "fetched": true,
  "status": "downloaded",
  "stateData": {
    "requestLatency": 21,
    "requestTime": 28,
    "contentLength": 278,
    "contentType": "text/html; charset=utf-8",
    "code": 200,
    "headers": {
      "content-type": "text/html; charset=utf-8",
      "content-length": "278",
      "etag": "W/\"116-XLd4QBoQli2+6XLPb3Hinw\"",
      "date": "Wed, 17 Feb 2016 15:02:57 GMT",
      "connection": "close"
    },
    "downloadTime": 7,
    "actualDataSize": 278,
    "sentIncorrectSize": false
  },
  "meta": {
    "title": "Meta Page",
    "description": "Meta Test",
    "keywords": "meta, link, http, linkdown"
  }
}
```

#### See

linkdown-exec(1)

### Tree

Reads line-delimited JSON records on stdin and parses the records into a tree structure representing the requests. Designed to be used in conjunction with `meta` so that meta data may be injected into each request before converting to the tree structure.

The tree structure may then be used to generate a sitemap. Output is keyed by fully qualified host name to allow for the scenario when a crawl resolves to multiple hosts.

Be careful with this command, it needs to buffer all the records into memory in order to be able to create the tree structure correctly and also needs to parse each JSON record as well as stringify when printing to stdout. For small to medium size sites this should not be a problem but if you input data for a huge site the process will hang and you may even run out of memory.

#### Options

* `indent: --indent [num]`: Number of spaces to indent.
* `labels: --labels, --path-labels`: Use the path name for labels.
* `listStyle: --list-style [style]`: Set an output list style. 
* `link: --link [format]`: Link format; one of relative, absolute or none.
* `listDescription: --desc, --description`: Include meta description.

#### Output

By default this command will print a JSON document, when `--indent` is specified the JSON document is indented.

By default labels for this tree view are inferred from the data available, to use more predictable labels that always use the URL path name specify `--path-labels`. When the tree output contains multiple trees to print (multiple hosts) each tree is separated by a delimiter which is dependent upon the list style format (see below).

If the `--list-style` option is given the output is a list in one of the following formats:

* `tty`: Hierarchy list suitable for a terminal, multiple trees delimited by a newline.
* `md`: Markdown list, multiple trees delimited by a newline.
* `html`: List for HTML pages, multiple trees use new lists.
* `jade`: List for the jade template language, multiple trees use new lists.

Links are created by default (with the exception of the `tty` list style) using a relative path from the root of the web server, you maybe disable automatic linking with `--link=none` or force to use absolute URLs with `--link=absolute`.

By default meta description text is printed when available but may by disabled with `--no-description`.

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

## Output

When the `--ouput` option is given printing is redirected to the specified file and is not written to stdout. If the file does not exist it is created otherwise it is truncated; if the file stream cannot be created an error is reported and the program will exit with a non-zero exit code.

## Signals

You may pause the crawl by sending the signal `TSTP` and resume a paused crawl by sending the signal `CONT`.

Attempting to send the `TSTP` signal on a paused crawl will have no effect as will attempting to send `CONT` when the crawl has not previously been paused with `TSTP`.

Note that depending upon the concurrency level you may see messages printed after a crawl is paused.

## Exit

The program will exit with a non-zero exit code when an error is encountered. When the crawl completes any 4xx and 5xx HTTP response codes will cause the program to exit with code 255. This guarantees that a success exit code of zero will only occur when the crawl completes and no HTTP error responses occurred.

## See

signal(7)
