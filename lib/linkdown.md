$0
==

Link manipulation tool.

## Commands

* `info: info, i`: Print link information.
* `validate: validate, v`: Validate HTML pages with the nu validator.

## Options

* `conf: -c, --conf=[file...]`: Load crawler configuration files.
* `logLevel: --log-level=[level]`: Set the log level.
* `depth: --depth=[int]`: Maximum depth to recurse.
* `follow: --[no]-follow`: Follow redirects.

### Validate

#### Options

* `format: --format=[fmt]`: Validator output format.
* `jar: --jar=[file]`: Path to the validator jar file.
* `--errors-only`: Proxied to the validator.

This command will fetch all pages ending with `.htm` and `.html`; URLs with no file extension are assumed to be directories serving HTML pages.

Each downloaded file is written to a temporary file and passed to the validator.

When no `--format` option is given the output format is set to JSON, the response document is parsed and printed to the screen.

When the `--format` option is given the raw validator output is printed to stdout, the first line is the remote URL, followed by the validator output followed by a newline.

Because all log messages are sent to stderr this means you can get an easy to parse log file with all validation results using `linkdown v --format json http://example.com > validation.log`.

## Example

Print links:

```
$0 info http://example.com
```

## See

${see_also}
