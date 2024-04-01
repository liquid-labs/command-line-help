import commandLineUsage from 'command-line-usage'
import { wrap } from 'wrap-text-plus'

import { formatTerminalText } from '@liquid-labs/terminal-text'

const commandLineHelp = ({ cliSpec, commands = [], globalOptions, mainOptionsGlobal = false, width = 80 }) => {
  let { command : mainCommand } = cliSpec
  mainCommand = mainCommand || cliSpec.mainCommand // deprecated alternate name for top level command
  let output = ''

  let sections

  if (commands.length === 0) {
    let { command, arguments : options } = cliSpec
    const { description, mainOptions } = cliSpec
    // mainCommand and mainOptions are deprecated keys; use command and arguments instead

    options = (options?.length > 0 && options) || mainOptions || []
    if (globalOptions !== undefined) {
      console.log('adding global options') // DEBUG
      options.push(...globalOptions)
    }
    options = options.filter(({ name }) => !name.match(/(?:sub-?)?command/i))
    console.log('options A:', options) // DEBUG

    const { commands : specCommands = [] } = cliSpec

    let usageMessage = command
    if (mainOptionsGlobal === false) {
      usageMessage += ' <options>'
    }
    if (specCommands.length > 0) {
      usageMessage += ' <command> <options>'
    }

    sections = [
      { header : colorHeader1(mainCommand), content : description },
      {
        header  : colorHeader2('Usage'),
        content : `${usageMessage}

Use '${mainCommand} --help [command]${mainOptionsGlobal === true ? "'/'[command] --help" : ''}' to get details on command options.`
      }
    ]

    output += wrap(formatTerminalText(commandLineUsage(sections)), { width })
    console.log('options B:', options) // DEBUG
    output += documentOptions({ options, width })
    output += documentCommands({ commands : specCommands, width })
  } else {
    let currSpec = cliSpec
    const commandsSeen = []
    for (const command of commands) {
      currSpec = currSpec.commands.find(({ name }) => name === command)

      if (currSpec === undefined) {
        return `No such command ${mainCommand} ${commandsSeen.join(' ')}`
      } // else
      commandsSeen.push(command)
    }

    const { commands : specCommands = [], description } = currSpec
    let { arguments : options = [] } = currSpec
    options = options.filter(({ name }) => !name.match(/(?:sub-?)?command/i))
    if (globalOptions !== undefined) {
      console.log('adding global options') // DEBUG
      options.push(...globalOptions)
    }

    sections = [
      { header : colorHeader1(`${mainCommand} ${commands.join(' ')}`), content : description }
    ]
    output += wrap(formatTerminalText(commandLineUsage(sections)), { width })
    output += documentOptions({ options, width })
    output += documentCommands({ commands : specCommands, width })
  }

  return output
}

const colorHeader1 = (header) => `<h1>${header}<rst>`

const colorHeader2 = (header) => `<h2>${header}<rst>`

const colorCommand = (name) => `<cyan1>${name}<rst>`

const colorOption = (name) => `<teal>${name}<rst>`

const documentCommands = ({ commands, width }) =>
  documentItems({ colorFunc : colorCommand, header : 'Commands', items : commands, width })

const documentItems = ({ colorFunc, header, items, width }) => {
  if (items.length > 0) {
    const longestItem = items.reduce((acc, { name }) => acc >= name.length ? acc : name.length, 0)

    return wrap(formatTerminalText(commandLineUsage({
      header  : colorHeader2(header),
      content : {
        options : { noWrap : true },
        data    : items.map(({ name, description }) => ({ name : colorFunc(name), summary : description }))
      }
    })), { width, hangingIndent : longestItem + 5 })
  } else {
    return ''
  }
}

const documentOptions = ({ options, width }) =>
  documentItems({ colorFunc : colorOption, header : 'Options', items : options, width })

export { commandLineHelp }
