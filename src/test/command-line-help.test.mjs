import { commandLineHelp } from '../command-line-help'

const simpleCLISpec = { command : 'testCommand', description : 'A test!' }
/* const fullCLISpec = {
  command     : 'testCommand',
  description : 'A test!',
  arguments   : [{ name : 'help', description : 'Prints help' }],
  commands    : [{ name : 'command', description : 'Does something.' }]
} */

describe('commandLineHelp', () => {
  describe('with no options or commands', () => {
    let help
    beforeAll(() => {
      help = commandLineHelp({ cliSpec : simpleCLISpec })
    })

    test('prints command and description with color', () => {
      expect(help).toMatch(/^[^a-zA-Z0-9]+testCommand[^a-zA-Z0-9]+/m)
      expect(help).toMatch(/A test!/m)
    })

    test("does not print 'Options' section", () => expect(help).not.toMatch(/Options/m))
    test("does not print 'Commands' section", () => expect(help).not.toMatch(/Commands/m))
  })

  /*
  TODO: doesn't work because command-line-usage doesn't respect no color option
  test("respects 'noColor' option", () => {
    const help = commandLineHelp({ cliSpec : simpleCLISpec, noColor: true })
    expect(help.split('\n').join(' ')).toMatch(/^[^a-zA-Z0-9! .<>-]+$/im)
  })
  */
})
