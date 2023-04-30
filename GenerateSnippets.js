console.log('Processing snippets...');

let fs = require('fs');

// A. VS Code Extension
var VSCodeSQLServerSnippet = {};
var VSCodeExtensionSQLServerJsonFile = './VS Code/Generator Output/tsql-snippets.json';

// B. SSMS
var snippetSSMSLiterals = '';

// ./ is the root of this repository
const snippetList = fs.readFileSync('./Snippets/Snippets.json').toString();
const snippetParse = JSON.parse(snippetList)

// Note: The name of the Snippet SQL file stored in "./Snippets" must match the name defined in the Snippets.json file
// Loop through each snippet
for(var snippet in snippetParse) {
    console.log('Snippet: ' + snippet);

    var snippetParameters =  snippetParse[snippet];
    var name = snippetParameters['name'].toString();
    var author = snippetParameters['author'].toString();
    var shortcut = snippetParameters['shortcut'].toString();
    var description = snippetParameters['description'].toString();
    var placeholders = snippetParameters['placeholders'];


    // A. VS Code Extension
    var snippetSQLServerObject = new Object();
    var snippetSQLServerSQL = fs.readFileSync('./Snippets/' + name + '.sql').toString();

    // B. SSMS
    var snippetSSMSSQL = fs.readFileSync('./Snippets/' + name + '.sql').toString();
    var snippetSSMSTemplate = fs.readFileSync('./SSMS/Templates/Snippet.xml').toString();

    // Loop through each SQL file and insert placeholders
    for (place in placeholders) {
        var PID = placeholders[place]['id'].toString();
        var pName = placeholders[place]['name'].toString();
        var pTip = placeholders[place]['tip'].toString();
        var pDefault = placeholders[place]['default'].toString();

    // A. VS Code Extension
    //const search = '{' + PID + '}';
    const search = "\\{" + PID + "\\}"; // Double backslash to escape the curly braces
    const replacer = new RegExp(search, 'g')

    snippetSQLServerSQL = snippetSQLServerSQL.replace(replacer, "${" + PID + ":" + pDefault+ "}");

    // B. SSMS
    snippetSSMSSQL = snippetSSMSSQL.replace(replacer, '{DS}' + pName + '{DS}'); // {DS} = $...because $ signs are special characters in Javascript we replace it later

        snippetSSMSLiterals += `
            <Literal>
                <ID>` + pName + `</ID>
                <ToolTip>` + pTip + `</ToolTip>
                <Default>` + pDefault + `</Default>
            </Literal>
        `;
    }

    // Build the VS Code JSON data
    // A. VS Code Extension: SQL Server
    snippetSQLServerObject.prefix = shortcut;
    snippetSQLServerObject.description = description;
    snippetSQLServerObject.body = snippetSQLServerSQL;

    VSCodeSQLServerSnippet[name] = snippetSQLServerObject;

    // B. SSMS
    // Build and create the SSMS XML data and files (each snippet is stored in a separate .snippet file which are then imported into SSMS)
    snippetSSMSTemplate = snippetSSMSTemplate.replace('{Name}', name);
    snippetSSMSTemplate = snippetSSMSTemplate.replace('{Description}', description);
    snippetSSMSTemplate = snippetSSMSTemplate.replace('{Author}', author);
    snippetSSMSTemplate = snippetSSMSTemplate.replace('{Parameters}', snippetSSMSLiterals);
    snippetSSMSTemplate = snippetSSMSTemplate.replace('{SQL}', snippetSSMSSQL);

    // In Javascript, the $ sign is special, so when it was replaced previously in the snippetSSMSSQL variable, the replacement directly above, {SQL}, got all messed up so we insert the dollar signes right before writing the file here
    snippetSSMSTemplate = snippetSSMSTemplate.replace(/{DS}/g, '$');  // the /g is replace all occurences otherwise Javascript will only replace the first occurence
    fs.writeFileSync('./SSMS/Generator Output/' + name+ '.snippet', snippetSSMSTemplate);
}

// Create the VS Code JSON snippet files (all snippets are stored in one file for VS Code)

// A. VS Code Extension
//fs.writeFileSync('./Snippet Generator/Generator Output/VS Code/tsql-snippets.json', JSON.stringify(VSCodeSQLServerSnippet));
fs.writeFileSync(VSCodeExtensionSQLServerJsonFile, JSON.stringify(VSCodeSQLServerSnippet)); // Write a copy to the extension folder

//VSCodeExtensionSQLServerJsonFile

console.log('All snippets generated!');