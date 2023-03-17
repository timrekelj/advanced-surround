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

		let surround_with = (await vscode.window.showInputBox()) as string; 

		if (!surround_with) {
			vscode.window.showErrorMessage('No input from user');
			return;
		}

		let surround_prefix = surround_with
			.replace(" )", "( ")
			.replace(" ]", "[ ")
            .replace(" }", "{ ")
			.replace(")", "(")
			.replace("]", "[")
			.replace("}", "{");
		let surround_postfix = surround_with
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

				builder.insert(prefixPos, surround_prefix);
				builder.insert(postfixPos, surround_postfix);
			});
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
