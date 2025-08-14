import {WorkspaceLeaf} from "obsidian";

export async function ActivateView(viewType: string) {
    let leaf: WorkspaceLeaf | null = null;
    const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType(viewType);

    if (leaves.length > 0) {
        leaf = leaves[0];
    } else {
        leaf = this.app.workspace.getLeaf(false);
        await leaf.setViewState({type: viewType, active: true});
    }

    await this.app.workspace.revealLeaf(leaf);
}

export async function ReplaceView(viewType: string) {
    const leaf: WorkspaceLeaf | null = this.app.workspace.getLeaf(false);
    if(!leaf) return;

    await leaf.setViewState({type: viewType, active: false});
}