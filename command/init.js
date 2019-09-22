const path = require('path')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const ora = require('ora')
const chalk = require('chalk')
const childProcess = require('child_process')
const { branchs, github } = require('../utils/config')

module.exports = async function (dir = '.', cmd) {
  // 询问类型
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: '项目名称',
      name: 'name',
      validate(answer) {
        if (answer === '') {
          return '项目名称不能为空!'
        }
        return true
      }
    },
    {
      type: 'list',
      message: '选择类型',
      name: 'type',
      choices: branchs
    },
    {
      type: 'confirm',
      message: '是否自动安装依赖?',
      name: 'isAuto',
      default: true
    }
  ])
  const { name, type, isAuto } = answers
  const projectDir = path.resolve(dir, name)    // 项目目录

  // 下载模板
  const tplLoading = ora('正在拉取模板...').start()
  await new Promise(function (resolve, reject) {
    download(`${github}#${type}`, projectDir, err => {
      err ? reject() : resolve()
    })
  }).then(() => {
    tplLoading.succeed('拉取成功')
  }).catch(() => {
    tplLoading.fail('拉取失败!')
  })  

  // 自动安装依赖
  const cdShell = `cd ${path.join(dir, name)}`
  const cdInstallShell = `${cdShell} && npm i`
  if (isAuto) {
    const shellLoading = ora('正在安装依赖...').start()
    await new Promise(function (resolve, reject) {
      childProcess.exec(cdInstallShell, err => {
        err ? reject() : resolve()
      })
    }).then(() => {
      shellLoading.succeed('安装依赖成功')
    }).catch(() => {
      shellLoading.fail('安装依赖失败!')
    })  
  }
  console.log(`\n${chalk.bold('请手动执行:')} ${chalk.cyan(isAuto ? cdShell : cdInstallShell)}\n`)
}