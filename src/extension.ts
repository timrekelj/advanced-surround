"use strict";
import {
	addSurround,
	removeSurround,
	replaceSurround
} from './commands'
import * as vscode from 'vscode';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('surround-advanced.surround', addSurround));
	context.subscriptions.push(vscode.commands.registerCommand('surround-advanced.remove-surround', removeSurround));
	context.subscriptions.push(vscode.commands.registerCommand('surround-advanced.replace-surround', replaceSurround));
}

// This method is called when your extension is deactivated
export function deactivate() {}
