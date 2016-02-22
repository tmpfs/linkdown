### Tree

Reads line-delimited JSON records written to stdin and converts to a tree structure, designed to be used after meta data has been injected so that a site map can be generated dynamically.

Note that the resulting tree is keyed by fully qualified host name (including a port when necessary) so that it can handle the scenario when a crawl resolves to multiple hosts.

Generating a tree structure is a two stage process, first the site should be crawled and meta data injected:

```
linkdown exec --cmd 'linkdown meta' --json http://localhost:8080 > site.log.json
```

Note that the `--json` option is required to print the JSON records to stdout. Then you can generate a JSON tree with:

```
linkdown tree --indent=2 < site.log.json > site.tree.json
```

For more compact JSON do not specify `--indent`.

You can also pipe the records for a single command:

```
linkdown exec --cmd 'linkdown meta' --json http://localhost:8080 | linkdown tree > site.tree.json
```

The tree command can also print list(s) when `--list-style` is given, the list style may be one of:

* `tty`: Print the tree hierarchy suitable for display on a terminal.
* `html`: Print an HTML unordered list.
* `md`: Print a markdown list.
* `jade`: Print a list suitable for [jade][].

For the `tty` and `md` list styles when multiple trees are generated (multiple hosts) they are delimited with a newline; for the `html` and `jade` list styles distinct lists are printed.

Sometimes it is useful to get a quick view of the tree without the injected meta data; use the `--labels` option to always use the path name for the node label, for example:

```
linkdown tree --list-style=tty --labels < site.log.json
```
