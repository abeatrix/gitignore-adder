// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  const toAppend = vscode.workspace
    .getConfiguration('gitignore-adder')
    .get('append');
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let createFile = vscode.commands.registerCommand(
    'gitignore-adder.creator',
    async () => {
      const rootDir = vscode.workspace.workspaceFolders
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : null;
      const newFile = new vscode.WorkspaceEdit();
      const filePath = vscode.Uri.file(rootDir + '/.gitignore');
      // Create a .gitignore file if it doesn't exist
      newFile.createFile(filePath, { ignoreIfExists: true });
      await vscode.workspace.applyEdit(newFile);
      await vscode.workspace
        .openTextDocument(filePath)
        .then((doc) => doc.save());
      // Display a message box to the user
      vscode.window.showInformationMessage('Git Ignore has been created!');
    }
  );

  let addToFile = vscode.commands.registerCommand(
    'gitignore-adder.adder',
    async (uri: vscode.Uri) => {
      const rootDir = vscode.workspace.workspaceFolders
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : null;
      const newFile = new vscode.WorkspaceEdit();
      const filePath = vscode.Uri.file(rootDir + '/.gitignore');
      // Create a .gitignore file if it doesn't exist
      newFile.createFile(filePath, { ignoreIfExists: true });
      const selected = uri.path.replace(`${rootDir}/`, '');
      const textDocument = await vscode.workspace.openTextDocument(filePath);
      await newFile.insert(
        filePath,
        new vscode.Position(toAppend ? textDocument.lineCount + 1 : 0, 0),
        selected + '\n'
      );
      await vscode.workspace.applyEdit(newFile);
      await textDocument.save();
      // Display a message box to the user
      vscode.window.showInformationMessage(
        'Added selected file to .gitignore!'
      );
    }
  );

  context.subscriptions.push(createFile, addToFile);
}

// this method is called when your extension is deactivated
export function deactivate() {}
