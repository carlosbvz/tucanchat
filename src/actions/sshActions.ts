'use server'

import { NodeSSH } from 'node-ssh'

export async function executeRemoteCommand(command: string) {
    const ssh = new NodeSSH()

    try {
        // Connect to the remote server with the correct port
        await ssh.connect({
            host: 'kabre.cenat.ac.cr',
            username: 'curso-786',
            port: 22022, // Specific port for Kabre
            password: 'DtDak5sA',
        })

        // Execute the command
        const result = await ssh.execCommand(command)

        // Close the connection
        ssh.dispose()

        if (result.code === 0) {
            return {
                success: true,
                output: result.stdout,
            }
        } else {
            return {
                success: false,
                error: result.stderr,
            }
        }
    } catch (error) {
        console.error('SSH execution error:', error)
        return {
            success: false,
            error: 'Failed to execute command on remote server',
        }
    }
}

export async function uploadFileToServer(
    localFilePath: string,
    remoteFilePath: string
) {
    const ssh = new NodeSSH()

    try {
        console.log('Uploading file to server')
        // Connect to the remote server
        await ssh.connect({
            host: 'kabre.cenat.ac.cr',
            username: 'curso-786',
            port: 22022,
            password: 'DtDak5sA',
        })

        // Upload the file
        await ssh.putFile(localFilePath, remoteFilePath)

        // Close the connection
        ssh.dispose()

        console.log('File uploaded successfully')

        return {
            success: true,
            message: 'File uploaded successfully',
        }
    } catch (error) {
        console.error('File upload error:', error)
        return {
            success: false,
            error: 'Failed to upload file to remote server',
        }
    }
}
