const vscode = require('vscode');
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

/**
 * VS Code Extension Activation Handler
 * Plugin SaaS Branching Blueprint & Governance
 */
function activate(context) {
  console.log('Plugin IDE SaaS Workflow & Governance telah aktif!');

  // Perintah 1: Inisialisasi Cetakan Proyek Lengkap (Setup Blueprint)
  let disposableInit = vscode.commands.registerCommand('saasWorkflow.initProject', function () {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('Silakan buka folder proyek Anda terlebih dahulu di VS Code/IDE!');
      return;
    }

    const targetDir = workspaceFolders[0].uri.fsPath;
    const cliScript = path.join(__dirname, 'cli.js');

    try {
      execSync(`node "${cliScript}" "${targetDir}"`);
      vscode.window.showInformationMessage('🎉 Berhasil! Cetakan Tata Kelola SaaS & 4 Ruang Kerja telah disuntikkan ke proyek ini.');
    } catch (err) {
      vscode.window.showErrorMessage(`Gagal menyuntikkan template: ${err.message}`);
    }
  });

  // Perintah 2: Buat Ruang Kerja Fitur Baru (Create Feature Branch)
  let disposableFeature = vscode.commands.registerCommand('saasWorkflow.createFeatureBranch', async function () {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('Buka folder proyek Anda di IDE terlebih dahulu!');
      return;
    }

    const targetDir = workspaceFolders[0].uri.fsPath;

    const ticketId = await vscode.window.showInputBox({
      prompt: 'Masukkan Nomor Tiket Pekerjaan (Contoh: TK-102):',
      placeHolder: 'TK-102'
    });

    if (!ticketId) return;

    const featureName = await vscode.window.showInputBox({
      prompt: 'Masukkan Nama Fitur Singkat (Bahasa Bisnis):',
      placeHolder: 'laporan-penjualan-excel'
    });

    if (!featureName) return;

    const branchName = `feature/${ticketId}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;

    try {
      execSync(`git checkout develop && git checkout -b ${branchName}`, { cwd: targetDir });
      vscode.window.showInformationMessage(`✅ Ruang Kerja Fitur Terbuat: ${branchName}`);
    } catch (err) {
      vscode.window.showErrorMessage(`Gagal membuat ruang kerja: ${err.message}`);
    }
  });

  context.subscriptions.push(disposableInit, disposableFeature);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
