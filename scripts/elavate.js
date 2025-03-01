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

const scriptPath = path.join(__dirname, 'elavate.js');
elevatePermissions(scriptPath);
