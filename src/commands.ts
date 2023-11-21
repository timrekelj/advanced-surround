import * as vscode from 'vscode';

function getSurroundRange(selection: vscode.Selection): {startRange: vscode.Range, endRange: vscode.Range, error: number} {
    let editor = vscode.window.activeTextEditor;

    let startRange = new vscode.Range(selection.start, new vscode.Position(selection.start.line, selection.start.character + 1));
    let endRange = new vscode.Range(selection.end, new vscode.Position(selection.end.line, selection.end.character - 1));

    let counterStart = 1;
    let counterEnd = 1;

    while (true) {
        if (editor?.document.getText(startRange) === " ") {
            console.log("start: " + editor?.document.getText(startRange));
            startRange = new vscode.Range(
                new vscode.Position(selection.start.line, selection.start.character + counterStart),
                new vscode.Position(selection.start.line, selection.start.character + counterStart + 1)
            );
            counterStart++;
            continue;
        }
        if (editor?.document.getText(endRange) === " ") {
            console.log("end: " + editor?.document.getText(endRange));
            endRange = new vscode.Range(
                new vscode.Position(selection.end.line, selection.end.character - counterEnd),
                new vscode.Position(selection.end.line, selection.end.character - counterEnd - 1)
            );
            counterEnd++;
            continue;
        }
        break;
    }

    return {startRange, endRange, error: 0};
}

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
        .replace(" ]]", "[[ ")
        .replace(" }", "{ ")
        .replace(" }}", "{{ ")
        .replace(")", "(")
        .replace("]", "[")
        .replace("}", "{")
        .replace(">", "<");
    let surroundPostfix = surroundWith
        .replace("( ", " )")
        .replace("[ ", " ]")
        .replace("[[ ", " ]]")
        .replace("{ ", " }")
        .replace("{{ ", " }}")
        .replace("(", ")")
        .replace("[", "]")
        .replace("{", "}")
        .replace("<", ">");
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
        vscode.commands.executeCommand('extension.vim_escape');
        editor!.selection = new vscode.Selection(position, position);
    });
}

export async function removeSurround() {
    let editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active text editor');
        return;
    }

    let selections = editor.selections;

    editor!.edit((builder) => {
        selections.forEach((selection) => {
            if (selection.isEmpty) {
                return;
            }

            let { startRange, endRange } = getSurroundRange(selection);
            
            builder.delete(startRange);
            builder.delete(endRange);
        });
    }).then(_ => {
        vscode.commands.executeCommand('extension.vim_escape');
    });
}

export async function replaceSurround() {
    vscode.window.showErrorMessage('Work in progress...');
}