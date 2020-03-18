import { Argv, CommandModule } from 'yargs'
import { Context } from 'src/cli/Context'
import { deployAppCmd } from 'src/cli/commands/deployAppOptions'
import { deployK8sApp } from 'src/deployment/k8s/cmds/deployK8sApp'
import { absPath } from 'src/cli/pathResolver'
import { deployConfigCmd } from 'src/cli/commands/deployConfigOptions'
import { deployK8sConfig } from 'src/deployment/k8s/cmds/deployK8sConfig'
import { K8sDeployOps } from 'src/deployment/k8s/cmds/createK8sDeployer'

const extractOpts = (args: any): K8sDeployOps => ({
    // TODO unify abs dir path
    dir: absPath(args.dir as string),
    cluster: args.cluster as string
})

const k8sCmd = (ctx: Context): CommandModule => ({
    command: 'k8s',
    describe: 'k8s based deployment commands',
    builder: (y: Argv) =>
        y
            .command({
                ...deployAppCmd,
                handler: args => {
                    deployK8sApp(
                        deployAppCmd.extractOps(args),
                        extractOpts(args),
                        ctx
                    )
                }
            })
            .command({
                ...deployConfigCmd,
                handler: args => {
                    deployK8sConfig(
                        deployConfigCmd.extractOps(args),
                        extractOpts(args),
                        ctx
                    )
                }
            })
            .options({
                dir: {
                    demandOption: true,
                    type: 'string'
                },
                cluster: {
                    demandOption: true,
                    type: 'string'
                }
            })
            .demandCommand(),
    handler: args => {
        throw new Error('Unexpected execution path')
    }
})

export default k8sCmd
