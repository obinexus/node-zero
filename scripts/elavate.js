#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

function elevatePermissions(filePath) {
    try {
        let command, args;
        
        if (process.platform === 'win32') {
            // Windows - using PowerShell to set executable permissions
            command = 'powershell';
            args = [
                '-Command',
                `Set-ItemProperty -Path "${filePath}" -Name IsReadOnly -Value $false`
            ];
        } else {
            // Unix-like systems - using sudo chmod
            command = 'sudo';
            args = ['chmod', '+x', filePath];
        }

        const proc = spawn(command, args);
        
        proc.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        proc.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        proc.on('close', (code) => {
            if (code === 0) {
                console.log('Permissions updated successfully');
            } else {
                console.error(`Process exited with code ${code}`);
            }
        });
    } catch (error) {
        console.error('Error elevating permissions:', error);
    }
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
// Get the path to node-zero executable
const nodeBinPath = path.join(process.env.HOME || os.homedir(), 
    process.platform === 'win32' 
        ? 'AppData\\Roaming\\nvm\\v23.7.0\\node-zero.exe'
        : '.nvm/versions/node/v23.7.0/bin/node-zero'
);

// Execute permission elevation
=======
=======
>>>>>>> dev
=======
>>>>>>> dev
// Get the path to CLI executable
const cliPath = path.join(__dirname, '..', 'dist', 'bin', 'cli.js');
const nodeBinPath = path.join(process.env.HOME || os.homedir(), 
    'dist/bin/cli.js'
);

// Execute permission elevation for both files
elevatePermissions(cliPath);
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> dev
=======
>>>>>>> dev
=======
>>>>>>> dev
elevatePermissions(nodeBinPath);