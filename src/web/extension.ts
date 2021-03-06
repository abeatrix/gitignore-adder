// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "gitignore-adder.createFile",
    async () => {
      const rootDir = vscode.workspace.workspaceFolders
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : null;
      const newFile = new vscode.WorkspaceEdit();
      const filePath = vscode.Uri.file(rootDir + "/.gitignore");
      // Create a .gitignore file if it doesn't exist
      newFile.createFile(filePath, { ignoreIfExists: true });
      await vscode.workspace.applyEdit(newFile);
      await vscode.workspace
        .openTextDocument(filePath)
        .then((doc) => doc.save());
      // Display a message box to the user
      vscode.window.showInformationMessage("Git Ignore has been created!");
    }
  );

  let disposable2 = vscode.commands.registerCommand(
    "gitignore-adder.addFile",
    async (uri: vscode.Uri) => {
      const rootDir = vscode.workspace.workspaceFolders
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : null;
      const newFile = new vscode.WorkspaceEdit();
      const filePath = vscode.Uri.file(rootDir + "/.gitignore");
      // Create a .gitignore file if it doesn't exist
      newFile.createFile(filePath, { ignoreIfExists: true });
      const selected = uri.path.replace(`${rootDir}/`, "");
      await newFile.insert(
        filePath,
        new vscode.Position(0, 0),
        selected + "\n"
      );
      await vscode.workspace.applyEdit(newFile);
      const textDocument = await vscode.workspace.openTextDocument(filePath);
      await textDocument.save();
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Added selected file to .gitignore!"
      );
    }
  );

  context.subscriptions.push(disposable, disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {}
