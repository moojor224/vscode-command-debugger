import { LoggingDebugSession, TerminatedEvent } from "@vscode/debugadapter";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider("vscode-command", {
        provideDebugConfigurations() {
            return [
                {
                    name: "Command Example: Open new window",
                    request: "launch",
                    type: "vscode-command",
                    command: "vscode.newWindow",
                }
            ];
        }
    }, vscode.DebugConfigurationProviderTriggerKind.Dynamic));
    context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory("vscode-command", new DebugAdapterFactory()));
}

class DebugAdapterFactory implements vscode.DebugAdapterDescriptorFactory {
    createDebugAdapterDescriptor(session: vscode.DebugSession) { // this is called when the debug session starts
        return new vscode.DebugAdapterInlineImplementation(new DebugSession(session.configuration));
    }
}

class DebugSession extends LoggingDebugSession {
    constructor(config: vscode.DebugConfiguration) {
        super();
        vscode.commands.executeCommand(config.command).then(() => {
            this.sendEvent(new TerminatedEvent());
        });
    }
}

export function deactivate() { }
