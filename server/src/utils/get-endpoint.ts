import inquirer from 'inquirer'
import type { Answers } from 'inquirer'
import os from 'os'

/** Example OPC UA server endpoints:
 * opc.tcp://SAMETC:26543/Matrikon.OPC.Simulation.1
 * opc.tcp://SAMETC:26543/opcserversim.instance.1
 * opc.tcp://SAMETC:26543
 * opc.tcp://opcuademo.sterfive.com:26543/UA/SampleServer
 */

/**
 * Prompts the user to select an OPC UA server endpoint type and returns the selected endpoint URL.
 *
 * The function uses `inquirer` to prompt the user with a series of questions to determine the endpoint type.
 * Depending on the user's choice, it will either construct a local OPC UA endpoint URL or use a custom endpoint URL provided by the user.
 *
 * @returns {Promise<string>} A promise that resolves to the selected OPC UA endpoint URL.
 *
 * @example
 * ```typescript
 * const endpoint = await getSelectedEndpoint();
 * console.log(endpoint); // Outputs the selected OPC UA endpoint URL
 * ```
 */
export async function getSelectedEndpoint(): Promise<string> {
  const urlPattern = /^(opc\.tcp:\/\/[^\s]+(:\d+)?\/[^\s]*)$/ // Regular expression to validate the OPC UA endpoint URL format
  const hostname = os.hostname() // Get the hostname of the local machine
  let selectedEndpoint // The selected OPC UA endpoint URL
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'endpointType',
      message: 'Select an OPC UA server endpoint type:',
      choices: ['Local', 'Custom'],
    },
    {
      type: 'input',
      name: 'host',
      message: `Enter the host name`,
      default: hostname,
      when: (answers: Answers) => answers.endpointType === 'Local',
      validate: (input: string) => {
        return input ? true : 'Please enter a valid host.'
      },
    },
    {
      type: 'input',
      name: 'port',
      default: '26543',
      message: 'Enter the port:',
      when: (answers: Answers) => answers.endpointType === 'Local',
      validate: (input: string) => {
        const portPattern = /^[0-9]+$/
        if (portPattern.test(input)) {
          return true
        } else {
          return 'Please enter a valid port number.'
        }
      },
    },
    {
      type: 'input',
      name: 'path',
      message: 'Enter the path (e.g., /Matrikon.OPC.Simulation.1):',
      default: '/',
      when: (answers: Answers) => answers.endpointType === 'Local',
      validate: (input: string) => {
        return input.startsWith('/') ? true : "Path should start with a '/'."
      },
    },
    {
      type: 'input',
      name: 'customEndpoint',
      message:
        'Enter your custom OPC UA endpoint URL (e.g., opc.tcp://<hostname>:<port>/<path>):',
      when: (answers: Answers) => answers.endpointType === 'Custom',
      validate: (input: string) => {
        return urlPattern.test(input)
          ? true
          : 'Please enter a valid OPC UA endpoint URL (e.g., opc.tcp://hostname:port/path).'
      },
    },
  ])

  if (answers.endpointType === 'Local') {
    selectedEndpoint = `opc.tcp://${answers.host}:${answers.port}${answers.path}`
    if (!urlPattern.test(selectedEndpoint)) {
      console.error('Invalid OPC UA URL format.')
    }
  } else if (answers.endpointType === 'Custom') {
    selectedEndpoint = answers.customEndpoint
  } else {
    selectedEndpoint = answers.endpointType
  }

  return selectedEndpoint
}
