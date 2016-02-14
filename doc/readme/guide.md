## Guide

### Info

Print link status codes, URLs and buffer lengths:

```
linkdown info http://example.com
```

Output:

```
 INFO | 200 http://example.com/ (1270 bytes)
```

### Validate

Validate all HTML pages on a website using the [nu validator][validator].

To use this command you should have Java 1.8 installed and [download the validator][validator-releases] jar file. This command was tested using `v16.1.1`.

You can use the `--jar` option to specify the path to the jar file but it is recommended you set the environment variable `NU_VALIDATOR_JAR` so that there is no need to keep specifying on the command line.

```
linkdown validate http://example.com
```

Output:

```
 INFO | 200 http://example.com/ (1270 bytes)
 INFO | validation passed http://example.com/
```

When the validate command encounters errors they are printed to screen in a format that enables easily debugging and fixing the errors much like the online w3 validation service.

#### Example Validation Output

```
ERROR | validation failed on http://localhost:3000/stars
 HTML |
 HTML | 1) http://localhost:3000/stars
 HTML |
 HTML | From line 2, column 1311; to line 2, column 1315
 HTML |
 HTML | Element “div” not allowed as child of element “label” in this context.
 HTML | (Suppressing further errors from this subtree.)
 HTML |
 HTML |   "chooser"><div><input
 HTML | ------------^
 HTML |
 HTML | 2) http://localhost:3000/stars
 HTML |
 HTML | From line 2, column 1763; to line 2, column 1800
 HTML |
 HTML | Attribute “disabled” not allowed on element “a” at this point.
 HTML |
 HTML |   at-right"><a href="#ok" disabled class="button">Import
 HTML | ------------^
 HTML |
```
