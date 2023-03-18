"use strict";
import * as vscode from 'vscode';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('surround-advanced.surround', async () => {

		let editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('No active text editor');
			return;
		}

		let surroundWith = (await vscode.window.showInputBox()) as string; 

		if (!surroundWith) {
			vscode.window.showErrorMessage('No input from user');
			return;
		}

		let surroundPrefix = surroundWith
			.replace(" )", "( ")
			.replace(" ]", "[ ")
            .replace(" }", "{ ")
			.replace(")", "(")
			.replace("]", "[")
			.replace("}", "{");
		let surroundPostfix = surroundWith
			.replace("( ", " )")
			.replace("[ ", " ]")
			.replace("{ ", " }")
			.replace("(", ")")
			.replace("[", "]")
			.replace("{", "}");
		let selections = editor.selections;
		
		editor!.edit((builder) => {
			selections.forEach((selection) => {
				let prefixPos = !selection.isReversed ? selection.anchor : selection.active;
				let postfixPos = !selection.isReversed ? selection.active : selection.anchor;

				builder.insert(prefixPos, surroundPrefix);
				builder.insert(postfixPos, surroundPostfix);
			});
		})
		.then(success => {
			var position = editor!.selection.end;
			editor!.selection = new vscode.Selection(position, position);
			vscode.commands.executeCommand('extension.vim_escape');
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
