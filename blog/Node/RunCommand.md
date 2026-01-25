```ts
import { StdioOptions, spawn } from 'child_process'

export const execShell = (
  command: string,
  args: string[] = [],
  stdio: StdioOptions = 'inherit',
  cwd = process.cwd()
) =>
  new Promise<string>((resolve, reject) => {
    console.log(`+ ${command} ${args.join(' ')}`)
    const task = spawn(command, args, {
      cwd,
      env: process.env,
      shell: true,
      stdio,
    })

    if (stdio === 'inherit') {
      task.on('close', resolve)
    } else {
      let result = ''
      let error = ''
      task.stdout.on('data', data => {
        console.log(`${data}`)
        result += data
      })

      task.stderr.on('data', data => {
        error += data
      })

      task.on('close', code => {
        if (code === 0) {
          resolve(result)
        } else {
          reject(error)
        }
      })
    }
  })

export const runCmd = async (cwd: string, cmd: string) => {
  let output: string
  let error: string

  const meta = cmd.split(' ')
  const cli = meta.shift()

  try {
    output = await execShell(cli, meta, 'pipe', cwd)
  } catch (e) {
    error = e
  }
  return {
    output,
    error,
  }
}
```