<div align="center">
<a href="http://fontmeme.com/3d-fonts/"><img src="http://fontmeme.com/embed.php?text=xeon&name=cube.ttf&size=30&style_color=116111" alt="3D Fonts"></a>
</div>

# xeon

[![Join the chat at https://gitter.im/hzlmn/xeon](https://badges.gitter.im/hzlmn/xeon.svg)](https://gitter.im/hzlmn/xeon?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
> #### module loader for bash scripts with node `require("module")` style

## about
`xeon` tiny node.js based tool 

that simplify the process of creation modular and reusable bash scripts, 

large or small, for personal usage or sysadmin tasks 

## install
install node first then with npm do

> npm i -g xeon

**note** *it may require sudo mode to install global node package*

check availability with `xeon --help`

if you see help message you are ready to go

## example
Lets simply create one module that we'd like to use in future

For example here is one that have function in it that print your name to console

Pretty simple

`hello.sh`
```sh
log_hello() {
  local name=$1
  echo "Hello, $name"
}
```

and lets add one more module that say bye to u

`bye.sh`
```sh
log_bye() {
  local name=$1
  echo "Bye, $name"
}
```

some fancy module as well

`unicorn_power.sh`
```sh
unicorn() {
  echo "meow"
}
```

and also some module that use other modules as well

`module_that_use_others.sh`
```sh
require("./bye.sh")
require("./unicorn_power.sh")

# and use functions from your modules
unicorn # will echo meow
log_bye "Oleh" # will echo Bye, Oleh
```

then create entry, for example, `app.sh` and require some modules too

`app.sh`
```sh
 require("./bye.sh")
 require("./module_that_use_others.sh")

 log_bye "Oleh"
```

then type at cmd `xeon --input ./app.sh --output ./build/build.sh`

it will read your requires, build dependency graph, resolve it and generate `./build/build.sh` file,

that you can run with `bash` cmd

there is an file watching option as well, just add `--watch` flag to previous command

Okay moving next...

Imagine that we create some useful badass script, and want to share it with someone or just save for future usage.

In typical workflow u just create snippet or put it somewhere on remote machine .eg and then seaching it for  hours or days, when u really need it.

With xeon you can use your shell script as npm modules as u used to (if you have node.js background).

So i have script that i upload to npm with own dependencies as well

in your app folder just install an npm module

```sh
  $ npm i --save my_module_name
```

Then use it in our entry `app.sh`

`app.sh`
```sh
 require("my_module_name")
 require("./bye.sh")
 require("./module_that_use_others.sh")

 log_bye "Oleh"
```

Xeon understand that u want to load file from node modules and will generate proper bundle file.

Here is sample module that use could play with and use as reference
> <a href="https://github.com/hzlmn/xeon-package-example">hzlmn/xeon-package-example</a>

Next imagine you find some great script on internet, that do what u actually need and want to use it with your script

just add `require("http://some.external.domain/awesome_script.sh")`;

`app.sh`
```sh
 require("http://some.external.domain/awesome_script.sh")
 require("my_module_name")
 require("./bye.sh")
 require("./module_that_use_others.sh")

 log_bye "Oleh"
```

Thats all, xeon will download and include that file as well

`Note!` for security reasons downloading external files not allowed by default 

You should use flag --external with previous command. Just be sure that u load good stuffs.


## plans for future

Right now, xeon just analyze your dependencies and merge files in correct order. 

It's a pretty straightforward way of doing bundling.

However, I am currently working on AST generator/stringifier for bash scripts,

that will allow xeon to build things faster, analyze code you are going to bundle and also transform scripts in a way

you want it to be (.eg fish shell scripts could be transformed to bash scripts while build process)

## license

MIT
