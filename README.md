# SQL Snippet Generator
* Programatically generate SQL snippets for use within SSMS
* Create a Visual Studio Code extension for analysts to utilize to speed up query development

# Instructions
## Prerequisites
1. Install Node.js
2. Run: npm install -g @vscode/vsce (this will give you the ability to create VS Code extensions)

## Creating Custom Snippets
1. Each snippet should be saved in a separate file in ./Snippets and should have a .sql extension
2. Snippet parameters are defined by {#} where # is the parameter number: {1}, {2}, {3}, etc.
3. Every .sql snippet file in ./Snippets must also be defined in ./Snippets/Snippets.json
4. Follow the pattern of the sample snippets defined in the Snippets.json file for any additional snippets you wish to add.  Some inportant values to note:
    * Shortcut - In VS Code/Azure Data Studio, this is the text you will type to bring up the snippet.  In SSMS, this is what will show in the snippet list
    * Placeholders - This defines the {#} parameters included in the .sql snippet files
5. Run: node GenerateSnippets.js (this will generate the files needed for snippets in SSMS and the VS Code Extension)

## SSMS
1. After running GenerateSnippets.js, the snippet files will be created in ./SSMS/Generator Output/*.snippet
2. Copy these files to another folder (this could be a fileshare which would allow snippets to be accessible by multiple people and managed globally)
3. In SSMS, go to Tools -> Code Snippets Manager
4. Click "Add" and choose the appropriate folder that contains your snippets

## VS Code
1. After running GenerateSnippets.js, the snippet data used by the VS Code extension will be created in ./VS Code/Generator Output/tsql-snippets.json
2. Ensure your working directory is the root of the repository
3. Run: vsce package
4. If you get this error: "...vsce.ps1 cannot be loaded because running scripts is disabled on this system" open PowerShell as an administrator and run: Set-ExecutionPolicy RemoteSigned (do this at your own risk)
5. If successful, the extension will be created: ./YourExtensionNAmeHereNoSpaces-1.0.0..vsix
6. Install the vsix file in VS Code and/or Azure Data Studio