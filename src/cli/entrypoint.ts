import Yargs from 'yargs'
import { deployApp } from 'src/deployment/cmds/deployApp'
import { absPath } from 'src/cli/pathResolver'
import { createExecutionContext } from 'src/cli/ExecutionContext'
import { deployConfig } from 'src/deployment/cmds/deployConfig'

const execCtx = createExecutionContext()

Yargs.scriptName('deploy')
    .usage('$0 <cmd> [args]')
    .command('vps', 'VPS based deployment', y => {
        y.command(
            'app <ver>', // We cannot use version as it is always boolean (probably conflicts with --version functionality)
            'Deploys given version of application',
            y => {
                y.positional('ver', {
                    type: 'string',
                    description: 'Version of app to be deployed'
                })
            },
            args => {
                deployApp(
                    args.ver as string,
                    {
                        dir: absPath(args.dir as string),
                        host: args.host as string
                    },
                    execCtx
                )
            }
        )
        y.command('config', 'Deploys application config', {}, args => {
            deployConfig(
                {
                    dir: absPath(args.dir as string),
                    host: args.host as string
                },
                execCtx
            )
        })
            .options({
                dir: {
                    demandOption: true,
                    type: 'string'
                },
                host: {
                    demandOption: true,
                    type: 'string'
                }
            })
            .demandCommand()
    })
    .alias('h', 'help')
    .help()
    // https://github.com/yargs/yargs/issues/895#issuecomment-392893305
    .demandCommand()
    .recommendCommands()
    .strict()
