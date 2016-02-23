#bash-require
> #### module loader for bash scripts with node `require("module")` style

## about
`bash-require` tiny node.js based tool 

that simplify creation of modular and reusable bash scripts, 

large or small, for personal usage or sysadmin tasks 

## install
install node first then with npm do

> npm i -g bash-require

**note** *it may require sudo mode to install global node package*

check availability with `br --help`

if you see help message you are good to go

## example
create module

`hello.sh`
```sh
log_hello() {
  local name=$1
  echo "Hello, $name"
}
```

and one more module

`bye.sh`
```sh
log_bye() {
  local name=$1
  echo "Bye, $name"
}
```

and more, and more

`unicorn_power.sh`
```sh
unicorn() {
  echo "meow"
}
```

then use some of your modules from other modules as you used for

`module_that_use_others.sh`
```sh
require("./bye.sh")
require("./unicorn_power.sh")

# and use functions from your modules
unicorn # will echo meow
log_bye "Oleh" # will echo Bye, Oleh
```

then create entry, for example, `app.sh` and require some modules

`app.sh`
```sh
 require("./bye.sh")
 require("./module_that_use_others.sh")

 log_bye "Oleh"
```

then type at cmd `br --input ./app.sh --output ./build/build.sh`

it will read your requires, build dependency graph, resolve it and generate `./build/build.sh` file,

that you can run with `bash`

also, there is a watching option

just add `--watch` flag to previous cmd and it will watch for changes in required files and build bundle on a fly

if you'd like to require external source, just type

```sh
require('http://domain.com/folder/my_script.sh')
```

## license

MIT





