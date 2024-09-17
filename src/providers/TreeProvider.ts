import * as vscode from 'vscode';

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
	public _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
  
	data: TreeItem[] = [];
  
	constructor(public isPinnedView: boolean = false)
	{
		this.getCommands(this.isPinnedView);
	}
  
	getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem>
	{
		return element;
	}
  
	getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]>
	{
		if (element === undefined) {
			return this.data;
		}
		return element.children;
	}

	getCommands(isPinnedView: boolean): void
	{
		vscode.commands.getCommands().then(commands => {
			let filterList: string[] = vscode.workspace.getConfiguration('commandpin').get('pinnedCommands') ?? [];

			let outputCommands = isPinnedView ?
				commands.filter((command: string) => filterList.includes(command)) :
				commands;

			this.data = outputCommands.map((command: string) => new TreeItem(command));
		});
	}

	refresh(): void {
		this.getCommands(true);
        this._onDidChangeTreeData.fire(undefined);
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