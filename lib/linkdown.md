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

* `jar: --jar=[file]`: Path to the validator jar file.

This command will fetch all pages ending with `.htm` and `.html` and URLs with no file extension are assumed to be directories serving HTML pages.

Each downloaded file is written to a temporary file and passed to the validator with the output format set to JSON, the response document is parsed and printed to screen.

## Example

Print links:

```
$0 info http://example.com
```

## See

${see_also}
