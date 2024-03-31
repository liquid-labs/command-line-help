import commandLineUsage from 'command-line-usage'

const commandLineHelp = ({ cliSpec, commands = [], mainOptionsGlobal = false }) => {
  let { command, arguments : options } = cliSpec
  const { mainCommand, description, mainOptions } = cliSpec
  // mainCommand and mainOptions are deprecated keys
  command = command || mainCommand
  options = options || mainOptions
  options = options.filter(({ name }) => !name.match(/(?:sub-?)command/i))

  let sections

  if (commands.length === 0) {
    const { commands : specCommands = [], arguments : options = [] } = cliSpec

    let usageMessage = command
    if (mainOptionsGlobal === false) {
      usageMessage += ' <options>'
    }
    if (specCommands.length > 0) {
      usageMessage += ' <command> <options>'
    }

    sections = [
      { header : mainCommand, content : description },
      {
        header  : 'Usage',
        content : `${usageMessage}

Use '${mainCommand} --help [command]${mainOptionsGlobal === true ? "'/'[command] --help" : ''}' to get details on command options.`
      }
    ]

    if (options.length > 0) {
      sections.push({
        header  : 'Options',
        content : options.map(({ name, description }) => ({ name, summary : description }))
      })
    }
    if (specCommands.length > 0) {
      sections.push({
        header  : 'Commands',
        content : cliSpec.commands.map(({ name, description }) => ({ name, summary : description }))
      })
    }
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
    options = options.filter(({ name }) => !name.match(/(?:sub-?)command/i))

    sections = [
      { header : `${mainCommand} ${commands.join(' ')}`, content : description }
    ]
    if (options.length > 0) {
      sections.push({
        header  : 'Options',
        content : options.map(({ name, description }) => ({ name, summary : description }))
      })
    }
    if (specCommands.length > 0) {
      sections.push({
        header  : 'Commands',
        content : cliSpec.commands.map(({ name, description }) => ({ name, summary : description }))
      })
    }
  }

  const usage = commandLineUsage(sections)

  return usage
}
/*
const makeSections = ({ command, commandsSpec = cliSpec, prefix }) => {
  const commandSpec = commandsSpec.commands.find(({ name }) => name === command)

  const details = commandSpec.description
  const options = commandSpec.arguments || []

  const optionList = options.map((v) => Object.assign({}, v))
  const defaultOptionIndex = optionList.findIndex(({ defaultOption }) => defaultOption)

  let title = prefix + ' ' + command
  let defaultOptionSpec

  if (defaultOptionIndex !== -1) {
    defaultOptionSpec = optionList[defaultOptionIndex]
    optionList.splice(defaultOptionIndex, 1)
  }

  if (optionList.length > 0) {
    title += ' <options>'
  }

  if (defaultOptionSpec !== undefined) {
    const { name, required } = defaultOptionSpec
    title += required === true ? ` [${name}]` : ` <${name}>`
  }

  const sections = [{ header : title, content : commandSpec.summary }]
  if (optionList.length > 0) {
    sections.push({ header : 'Options', optionList })
  }
  if (details !== undefined) {
    sections.push({ header : 'Details', content : details })
  }

  return sections
} */

export { commandLineHelp }
