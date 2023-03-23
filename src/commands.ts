import * as vscode from 'vscode';

export async function addSurround() {
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
    }).then(_ => {
        var position = editor!.selection.end;
        // TODO: check if vim extension is installed (test if this is even an issue)
        vscode.commands.executeCommand('extension.vim_escape');
        editor!.selection = new vscode.Selection(position, position);
    });
}

export async function removeSurround() {
    vscode.window.showErrorMessage('Work in progress...');
}

export async function replaceSurround() {
    vscode.window.showErrorMessage('Work in progress...');
}