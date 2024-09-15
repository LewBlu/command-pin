// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	vscode.window.registerTreeDataProvider('pinned-commands', new TreeDataProvider());

	const runCommand = vscode.commands.registerCommand('commandpin.runCommand', (command: TreeItem) => {
		vscode.commands.executeCommand(<string>command.label);
	});

	context.subscriptions.push(runCommand);
}

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
	onDidChangeTreeData?: vscode.Event<TreeItem|null|undefined>|undefined;
  
	data: TreeItem[] = [];
  
	constructor() {
		const filterList = ['undo', 'redo'];
		vscode.commands.getCommands().then(commands => {
			let commandList = commands.filter((command: string) => filterList.includes(command)).map((command: string) => new TreeItem(command));
			this.data = commandList;
		});
	}
  
	getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
		return element;
	}
  
	getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
		if (element === undefined) {
			return this.data;
		}
		return element.children;
	}
}

class TreeItem extends vscode.TreeItem {
	children: TreeItem[]|undefined;
  
	constructor(label: string, children?: TreeItem[]) {
		super(
			label,
			children === undefined ? vscode.TreeItemCollapsibleState.None :
									vscode.TreeItemCollapsibleState.Expanded);
	  	this.children = children;
	}
}

export function deactivate() {}
