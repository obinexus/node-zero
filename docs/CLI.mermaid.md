
```mermaid
classDiagram
    class cli {
        +createCLI()
        +main()
    }
    
    class Command {
        +program
        +command(name)
        +option(flags, desc)
        +action(callback)
    }
    
    class CommandRegistry {
        +registerCommands(program)
    }
    
    class FileHandler {
        +readId(filePath)
        +readKey(filePath)
        +readIdAndKey(filePath)
        +readProof(filePath)
        +readChallenge(filePath)
        +writeOutput(path, data, format)
    }
    
    class CreateCommand {
        +registerCreateCommand(program)
        +handleCreateCommand(options)
    }
    
    class VerifyCommand {
        +registerVerifyCommand(program)
        +handleVerifyCommand(options)
    }
    
    class DeriveCommand {
        +registerDeriveCommand(program)
        +handleDeriveCommand(options)
    }
    
    class ChallengeCommand {
        +registerChallengeCommand(program)
        +handleChallengeCommand(options)
    }
    
    class ProveCommand {
        +registerProveCommand(program)
        +handleProveCommand(options)
    }
    
    class VerifyProofCommand {
        +registerVerifyProofCommand(program)
        +handleVerifyProofCommand(options)
    }
    
    class InfoCommand {
        +registerInfoCommand(program)
        +handleInfoCommand(options)
    }
    
    class ZeroParser {
        +identifyFormat(input)
        +parseZidFile(content, format)
        +serializeData(data, format)
    }
    
    class HmacAuth {
        +deriveHmacKey(secret, publicData, options)
        +verifyHmacKey(derived, expected)
        +createHmacProof(secret, challenge, options)
        +verifyHmacProof(proof, challenge, publicKey, derivedKey, options)
    }
    
    class Base64Steg {
        +encodeIntoBase64Image(imageData, secretData, options)
        +decodeFromBase64Image(base64Image, password, options)
    }
    
    cli --> CommandRegistry
    CommandRegistry --> CreateCommand
    CommandRegistry --> VerifyCommand
    CommandRegistry --> DeriveCommand
    CommandRegistry --> ChallengeCommand
    CommandRegistry --> ProveCommand
    CommandRegistry --> VerifyProofCommand
    CommandRegistry --> InfoCommand
    
    CreateCommand --> FileHandler
    VerifyCommand --> FileHandler
    DeriveCommand --> FileHandler
    ChallengeCommand --> FileHandler
    ProveCommand --> FileHandler
    VerifyProofCommand --> FileHandler
    
    FileHandler --> ZeroParser
    
    CreateCommand --> HmacAuth
    ProveCommand --> HmacAuth
    VerifyProofCommand --> HmacAuth
    
    ProveCommand --> Base64Steg
    ```