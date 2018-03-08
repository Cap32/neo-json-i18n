# neo-json-i18n

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

```shell
$ neo-json-i18n <src> [options]
```

### Options

```js
output: {
    alias: 'o',
    describe: 'Output directory',
    type: 'string',
},
lang: {
    alias: 'l',
    type: 'array',
    describe: 'Languages',
    default: ['en'],
},
pattern: {
    alias: 'p',
    type: 'string',
    describe: 'Output file name pattern',
    default: '$name_$lang.$ext',
},
cwd: {
    alias: 'd',
    type: 'string',
    describe: 'Current working directory',
    default: process.cwd(),
},
spaces: {
    alias: 's',
    type: 'string',
    describe: 'JSON format spaces',
    default: '  ',
},
```

### Example

**~/my/repo/dict.json**

```json
{ "film": "Star Wars" }
```

`cd ~/my/repo/` and run `neo-json-i18n dict.json --lang zh-cn`, it would create
a `dict_zh-cn.json` file

**~/my/repo/dict_zh-cn.json**

```json
{ "film": "星球大战" }
```

## Node Module API Usage

```js
import jsonI18n from "neo-json-i18n";
const json = { film: "Star Wars" };
jsonI18n(json, { lang: ["zh-cn"] })
    .then(res => console.log(res))
    .catch(err => console.error(err));
/*
  output: { 'zh-cn': { film: '星球大战' } }
 */
```

output:

## License

MIT
