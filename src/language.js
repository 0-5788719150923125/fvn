const vscode = require('vscode')
const tokenTypes = [
    'class',
    'interface',
    'enum',
    'function',
    'variable',
    'keyword'
]
const tokenModifiers = ['declaration', 'documentation', 'input']
const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers)

const provider = {
    provideDocumentSemanticTokens(document) {
        // analyze the document and return semantic tokens

        const tokensBuilder = new vscode.SemanticTokensBuilder(legend)
        // on line 1, characters 1-5 are a class declaration

        tokensBuilder.push(
            new vscode.Range(
                new vscode.Position(1, 0),
                new vscode.Position(1, 11)
            ),
            'keyword',
            ['input']
        )

        return tokensBuilder.build()
    }
}

const selector = { language: 'src' } // register for all Java documents from the local file system

vscode.languages.registerDocumentSemanticTokensProvider(
    selector,
    provider,
    legend
)
