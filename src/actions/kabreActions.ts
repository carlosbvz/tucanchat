'use server'

import { executeRemoteCommand } from './sshActions'

export async function runNormalization() {
    try {
        // First, change directory
        const cdCommand =
            'cd class-examples/PP_UCR/OpenMP/example2_parallel_for'
        const cdResult = await executeRemoteCommand(cdCommand)

        if (!cdResult.success) {
            return {
                success: false,
                error: `Failed to change directory: ${cdResult.error}`,
            }
        }

        // Then, run the sbatch command
        const sbatchCommand = 'sbatch submit.slurm'
        const sbatchResult = await executeRemoteCommand(
            `${cdCommand} && ${sbatchCommand}`
        )

        if (!sbatchResult.success) {
            return {
                success: false,
                error: `Failed to submit Slurm job: ${sbatchResult.error}`,
            }
        }

        return {
            success: true,
            output: sbatchResult.output,
        }
    } catch (error) {
        console.error('Error running Slurm commands:', error)
        return {
            success: false,
            error: 'Failed to execute Slurm commands',
        }
    }
}
