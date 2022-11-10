let fs = require('fs');

console.log('Processing snippets...');

// ./ is the root of your working GIT folder for this project
const snippetList = fs.readFileSync('./Snippets.json').toString();
const snippetParse = JSON.parse(snippetList)

// Loop through each snippet
for(var snippet in snippetParse) {
    console.log('Snippet: ' + snippet);

    var snippetParameters =  snippetParse[snippet];
    var name = snippetParameters['name'].toString();
    var author = snippetParameters['author'].toString();
    var shortcut = snippetParameters['shortcut'].toString();
    var description = snippetParameters['description'].toString();
    var placeholders = snippetParameters['placeholders'];

    // The name of the Snippet SQL file must match the name defined in the Snippets.json file
    var snippetSSMSSQL = fs.readFileSync('./Snippets/' + name + '.sql').toString();
    var snippetSSMSTemplate = fs.readFileSync('./Templates/Snippet.xml').toString();
    var snippetSSMSLiterals = '';

    // Loop through each SQL file and insert placeholders
    for (place in placeholders) {
        var PID = placeholders[place]['id'].toString();
        var pName = placeholders[place]['name'].toString();
        var pTip = placeholders[place]['tip'].toString();
        var pDefault = placeholders[place]['default'].toString();

        const search = "\\{" + PID + "\\}"; // Double backslash to escape the curly braces
        const replacer = new RegExp(search, 'g')

        snippetSSMSSQL = snippetSSMSSQL.replace(replacer, '{DS}' + pName + '{DS}'); // {DS} = $...because $ signs are special characters in Javascript we replace it later

        snippetSSMSLiterals += `
            <Literal>
                <ID>` + pName + `</ID>
                <ToolTip>` + pTip + `</ToolTip>
                <Default>` + pDefault + `</Default>
            </Literal>
        `;
    }

    // Build and create the SSMS XML data and files (each snippet is stored in a separate .snippet file which are then imported into SSMS)
    snippetSSMSTemplate = snippetSSMSTemplate.replace('{Name}', name);
    snippetSSMSTemplate = snippetSSMSTemplate.replace('{Description}', description);
    snippetSSMSTemplate = snippetSSMSTemplate.replace('{Author}', author);
    snippetSSMSTemplate = snippetSSMSTemplate.replace('{Parameters}', snippetSSMSLiterals);
    snippetSSMSTemplate = snippetSSMSTemplate.replace('{SQL}', snippetSSMSSQL);

    // In Javascript, the $ sign is special, so when it was replaced previously in the snippetSSMSSQL variable, the replacement directly above, {SQL}, got all messed up so we insert the dollar signes right before writing the file here
    snippetSSMSTemplate = snippetSSMSTemplate.replace(/{DS}/g, '$');  // the /g is replace all occurences otherwise Javascript will only replace the first occurence
    fs.writeFileSync('./Generator Output/' + name+ '.snippet', snippetSSMSTemplate);

}

console.log('All snippets generated!');