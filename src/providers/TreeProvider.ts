import * as vscode from 'vscode';

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
	public _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
  
	data: TreeItem[] = [];
  
	constructor() {
		this.getCommands();
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

	getCommands() {
		let filterList: string[] = vscode.workspace.getConfiguration('commandpin').get('pinnedCommands') ?? [];
		vscode.commands.getCommands().then(commands => {
			let commandList: TreeItem[] = [];
			if(filterList.length) {
				commandList = commands.filter((command: string) => filterList.includes(command)).map((command: string) => new TreeItem(command));
			} else {
				commandList = [];
			}
			this.data = commandList;
		});
	}

	public refresh(): void {
		this.getCommands();
        this._onDidChangeTreeData.fire(undefined);
    }
}

export class AllTreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
	public _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
  
	data: TreeItem[] = [];
  
	constructor() {
		vscode.commands.getCommands().then(commands => {
			let commandList = commands.map((command: string) => new TreeItem(command));
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

export class TreeItem extends vscode.TreeItem {
	children: TreeItem[]|undefined;
  
	constructor(label: string, children?: TreeItem[]) {
		super(
			label,
			children === undefined ? vscode.TreeItemCollapsibleState.None :
									vscode.TreeItemCollapsibleState.Expanded);
	  	this.children = children;
	}
}