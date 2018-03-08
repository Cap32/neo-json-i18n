# neo-json-i18n

[![CircleCI](https://circleci.com/gh/Cap32/neo-json-i18n.svg?style=shield)](https://circleci.com/gh/Cap32/neo-json-i18n)
[![Build Status](https://travis-ci.org/Cap32/neo-json-i18n.svg?branch=master)](https://travis-ci.org/Cap32/neo-json-i18n)
[![Build status](https://ci.appveyor.com/api/projects/status/itq4dp7186526wcl?svg=true)](https://ci.appveyor.com/project/Cap32/neo-json-i18n)
[![Coverage Status](https://coveralls.io/repos/github/Cap32/neo-json-i18n/badge.svg?branch=master)](https://coveralls.io/github/Cap32/neo-json-i18n?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![License](https://img.shields.io/badge/license-MIT_License-blue.svg?style=flat)](https://github.com/Cap32/neo-json-i18n/blob/master/LICENSE.md)

Translate json files over google translate

## Installation

#### Via yarn

```shell
$ yarn global add neo-json-i18n
```

#### Via npm

```shell
$ npm install -g neo-json-i18n
```

## CLI Usage

```txt
neo-json-i18n <src> [options]

Translate json files over google translate

Positionals:
  src  Source file                                            [string]

Options:
  --output, -o   Output directory                             [string]
  --lang, -l     Languages                   [array] [default: ["en"]]
  --pattern, -p  Output file name pattern
                                [string] [default: "%name_%lang.%ext"]
  --cwd, -d      Current working directory                    [string]
  --spaces, -s   JSON format spaces           [string] [default: "  "]
  --help         Show help                                   [boolean]
  --version      Show version number                         [boolean]
```

##### Example

**~/my/repo/dict.json**

```json
{ "film": "Star Wars" }
```

Open terminal, and run:

```shell
$ cd ~/my/repo/
$ neo-json-i18n dict.json --lang zh-cn,ja
```

It would create `dict_zh-cn.json` and `dict_ja.json` file as result

**~/my/repo/dict_zh-cn.json**

```json
{ "film": "星球大战" }
```

**~/my/repo/dict_ja.json**

```json
{ "film": "スターウォーズ" }
```

## Node Module API Usage

```js
import jsonI18n from "neo-json-i18n";
const json = { film: "Star Wars" };
jsonI18n(json, { lang: ["zh-cn", "ja"] })
    .then(res => console.log(res))
    .catch(err => console.error(err));
/*
 * { 'zh-cn': { film: '星球大战' }, 'ja': { film: 'スターウォーズ' } }
 */
```

## License

MIT
