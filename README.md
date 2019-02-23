redir
=====

input processing tool

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/redir.svg)](https://npmjs.org/package/redir)
[![Downloads/week](https://img.shields.io/npm/dw/redir.svg)](https://npmjs.org/package/redir)
[![License](https://img.shields.io/npm/l/redir.svg)](https://github.com/rylabs/redir/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g redir
$ redir COMMAND
running command...
$ redir (-v|--version|version)
redir/0.0.0 darwin-x64 node-v10.12.0
$ redir --help [COMMAND]
USAGE
  $ redir COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`redir hello [FILE]`](#redir-hello-file)
* [`redir help [COMMAND]`](#redir-help-command)
* [`redir run [FILE]`](#redir-run-file)

## `redir hello [FILE]`

describe the command here

```
USAGE
  $ redir hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ redir hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/rylabs/redir/blob/v0.0.0/src/commands/hello.ts)_

## `redir help [COMMAND]`

display help for redir

```
USAGE
  $ redir help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `redir run [FILE]`

describe the command here

```
USAGE
  $ redir run [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/run.ts](https://github.com/rylabs/redir/blob/v0.0.0/src/commands/run.ts)_
<!-- commandsstop -->
