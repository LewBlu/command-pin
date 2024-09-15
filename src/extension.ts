// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AllTreeDataProvider, TreeDataProvider, TreeItem } from './providers/TreeProvider';

export function activate(context: vscode.ExtensionContext) {
	vscode.window.registerTreeDataProvider('pinned-commands', new TreeDataProvider());
	vscode.window.registerTreeDataProvider('all-commands', new AllTreeDataProvider());

	const runCommand = vscode.commands.registerCommand('commandpin.runCommand', (command: TreeItem) => {
		vscode.commands.executeCommand(<string>command.label);
	});

	context.subscriptions.push(runCommand);
}

export function deactivate() {}
