#!/usr/bin/env node
const program = require('commander')

program
  .version(require('../package').version)
  .option('-v, --version')

// 初始化 
program
  .command('init [dir]')
  .description('初始化')
  .action(require('../command/init'))

// help
program
  .command('help')
  .description('显示帮助')
  .action(() => {
    program.outputHelp()
  })

// 附加的帮助文档
program.on('--help', function(){
  console.log('')
  console.log('Examples:')
  console.log('  $ sea-koa init')
})

program.parse(process.argv)