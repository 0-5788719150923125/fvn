const vscode = require('vscode')
const tokenTypes = ['class', 'interface', 'enum', 'function', 'variable']
const tokenModifiers = ['declaration', 'documentation']
const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers)

const provider = {
    provideDocumentSemanticTokens(document) {
        // analyze the document and return semantic tokens

        const tokensBuilder = new vscode.SemanticTokensBuilder(legend)
        // on line 1, characters 1-5 are a class declaration
        tokensBuilder.push(
            new vscode.Range(
                new vscode.Position(1, 1),
                new vscode.Position(1, 5)
            ),
            'class',
            ['declaration']
        )
        return tokensBuilder.build()
    }
}

const selector = { language: 'src', scheme: 'file' } // register for all Java documents from the local file system

vscode.languages.registerDocumentSemanticTokensProvider(
    selector,
    provider,
    legend
)
