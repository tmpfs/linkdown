## Guide

### Info

Print link status codes, URLs and buffer lengths:

```
linkdown info http://example.com
```

```
200 http://example.com/ (1270 bytes)
```

### Configuration

The [default configuration](/linkdown.js) file is always loaded, you can load your own configuration file(s) which will be merged with the default. Configuration files should be javascript or JSON, for example:

```
linkdown info http://example.com -c /path/to/conf.js
```
