### Validate

Validate all HTML pages on a website using the [nu validator][validator].

To use this command you should have Java 1.8 installed and [download the validator][validator-releases] jar file. This command was tested using `v16.1.1`.

You can use the `--jar` option to specify the path to the jar file but it is recommended you set the environment variable `NU_VALIDATOR_JAR` so that there is no need to keep specifying on the command line.

When the validate command encounters errors they are printed to screen in a format that enables easily fixing the errors; much like the online w3 validation service.

