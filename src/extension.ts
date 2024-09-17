// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AllTreeDataProvider, TreeDataProvider, TreeItem } from './providers/TreeProvider';

export function activate(context: vscode.ExtensionContext) {
	const treeDataProvider = new TreeDataProvider();
	vscode.window.createTreeView('pinned-commands', { treeDataProvider });
	vscode.window.registerTreeDataProvider('all-commands', new AllTreeDataProvider());

	const runCommand = vscode.commands.registerCommand('commandpin.runCommand', (command: TreeItem) => {
		vscode.commands.executeCommand(<string>command.label);
	});

	const addPinned = vscode.commands.registerCommand('commandpin.addPinned', (command: TreeItem) => {
		let config = vscode.workspace.getConfiguration('commandpin');
		let commands: string[] = config.get('pinnedCommands') ?? [];
		if(!commands.includes(<string>command.label)) {
			config.update(
				'pinnedCommands', 
				commands.push(<string>command.label),
				true
			).then(() => treeDataProvider.refresh());
		}
	});

	const removePinned = vscode.commands.registerCommand('commandpin.removePinned', (command: TreeItem) => {
		let config = vscode.workspace.getConfiguration('commandpin');
		let commands: string[] = config.get('pinnedCommands') ?? [];
		config.update(
			'pinnedCommands',
			commands.filter(currentCommand => currentCommand != command.label),
			true
		).then(() => treeDataProvider.refresh());
	});

	context.subscriptions.push(
		runCommand,
		addPinned,
		removePinned
	);
	// context.subscriptions.push(addPinned);
	// context.subscriptions.push(removePinned);
}

export function deactivate() {}
