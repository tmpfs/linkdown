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

## Example

Print links:

```
$0 info http://example.com
```

## See

${see_also}
