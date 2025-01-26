import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const folderBadge = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		1000
	);

	folderBadge.text = getWorkspaceFolderName();
	folderBadge.tooltip = 'Nome da pasta/projeto atual';
	folderBadge.color = '#ff6464';
	folderBadge.show();

	const disposable = vscode.workspace.onDidChangeWorkspaceFolders(() => {
		folderBadge.text = getWorkspaceFolderName();
	});
	context.subscriptions.push(disposable);

	context.subscriptions.push(folderBadge);
}

export function deactivate() {
}

function getWorkspaceFolderName(): string {
	const folders = vscode.workspace.workspaceFolders;
	if (!folders || folders.length === 0) {
		return 'Sem Pasta';
	}
	return folders[0].name;
}
