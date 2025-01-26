import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const folderBadge = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		1000
	);

	const updateBadge = () => {
		const folderName = getWorkspaceFolderName();
		folderBadge.text = ` ${folderName} `;
		folderBadge.tooltip = 'Nome da pasta/projeto atual';
		folderBadge.backgroundColor = new vscode.ThemeColor('statusBar.background');
		folderBadge.color = new vscode.ThemeColor('statusBar.foreground');
		
		const color = generateColorFromString(folderName);
		folderBadge.command = {
			command: 'setContext',
			title: 'Set Badge Style',
			arguments: [{
				key: 'badgeStyle',
				value: `
					.status-bar-item.${folderBadge.id} { 
						background: ${color} !important;
						color: white !important;
						font-weight: bold;
					}
				`
			}]
		};
		
		folderBadge.show();
	};

	updateBadge();

	const disposable = vscode.workspace.onDidChangeWorkspaceFolders(() => {
		updateBadge();
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

function generateColorFromString(str: string): string {
	// Cria um hash simples da string
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	
	// Gera dois matizes diferentes para o gradient
	const hue1 = Math.abs(hash % 360);
	const hue2 = (hue1 + 40) % 360; // Offset de 40 graus para uma boa combinação
	
	// Retorna um gradient linear
	return `linear-gradient(to right, hsl(${hue1}, 70%, 25%), hsl(${hue2}, 70%, 25%))`;
}
