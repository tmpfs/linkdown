$0
==

Link manipulation tool.

## Commands

* `info: info, i`: Print crawl information.
* `validate: validate, v`: Validate (X)HTML pages (nu validator).

## Options

* `conf: -c, --conf=[file...]`: Load crawler configuration files.
* `logLevel: --log-level=[level]`: Set the log level.
* `depth: --depth=[int]`: Maximum depth to recurse.
* `follow: --[no]-follow`: Follow redirects.

### Validate

#### Options

* `format: --format=[fmt]`: Validator output format.
* `jar: --jar=[file]`: Path to the validator jar file.
* `--errors-only`: Warnings and info messages are not reported.

This command will fetch all pages ending with the `.htm`, `.html`, `.xhtml` and `.xht` extensions; URLs with no file extension are assumed to be directories serving (X)HTML pages. Each downloaded file is written to a temporary file and passed to the validator.

To use this command you must have java(1) installed (version 8 is recommended) and specify the path to the nu validator jar by setting `--jar` or the environment variable `NU_VALIDATOR_JAR`. 

If the server responds with a MIME type other than `text/html` or `application/xhtml+xml` validation is skipped and a warning is printed.

Without the `--format` option the format is set to `json`; the response document is parsed and printed to stderr.

When the `--format` option is given the raw validator output is printed to stdout, the first line is the remote URL, followed by the validator output followed by a newline.

Because all log messages are sent to stderr this means you can get an easy to parse log file with all validation results using `linkdown v --format json http://example.com > validation.log`.

## Example

Print crawl information:

```
$0 info http://example.com
```
