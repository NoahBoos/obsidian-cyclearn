import {Plugin, WorkspaceLeaf} from "obsidian";
import {DEFAULT_SETTINGS, I_CyclearnSettings} from "./settings/I_CyclearnSettings";
import {InitializeDatabase} from "./database/Database";
import {CyclearnStudioView, CYCLEARN_STUDIO_VIEW_TYPE} from "./views/CyclearnStudioView";
import {ActivateView} from "./utils/U_View";
import {CyclearnSettingTab} from "./settings/CyclearnSettingTab";
import {CreateDeckModal} from "./modals/CreateDeckModal";
import {
    CREATE_DECK_MODAL_OPTIONS, CREATE_NOTE_MODAL_OPTIONS,
    CREATE_TAG_MODAL_OPTIONS,
    CREATE_TEMPLATE_MODAL_OPTIONS
} from "./modals/I_ModalOptions";
import {CreateTagModal} from "./modals/CreateTagModal";
import {CreateTemplateModal} from "./modals/CreateTemplateModal";
import {CreateNoteModal} from "./modals/CreateNoteModal";
import {CYCLEARN_STUDY_VIEW_TYPE, CyclearnStudyView} from "./views/CyclearnStudyView";

export default class Cyclearn extends Plugin {
    settings: I_CyclearnSettings;

    async onload() {
        await this.LoadSettings();
        InitializeDatabase(this);
        this.registerView(CYCLEARN_STUDIO_VIEW_TYPE, (leaf: WorkspaceLeaf) => new CyclearnStudioView(leaf, this));
        this.registerView(CYCLEARN_STUDY_VIEW_TYPE, (leaf: WorkspaceLeaf) => new CyclearnStudyView(leaf, this));

        this.addCommand({
            id: "studio-view",
            name: "Studio view",
            callback: async () => {
                await ActivateView(CYCLEARN_STUDIO_VIEW_TYPE);
            }
        });

        this.addCommand({
           id: "study-view",
           name: "Study view",
           callback: async () => {
               await ActivateView(CYCLEARN_STUDY_VIEW_TYPE);
           }
        });

        this.addCommand({
            id: "create-deck",
            name: "Create a new deck",
            callback: () => {
                new CreateDeckModal(this.app, CREATE_DECK_MODAL_OPTIONS).open();
            }
        });

        this.addCommand({
           id: "create-tag",
           name: "Create a new tag",
           callback: () => {
               new CreateTagModal(this.app, CREATE_TAG_MODAL_OPTIONS).open();
           }
        });

        this.addCommand({
            id: "create-template",
            name: "Create a new template",
            callback: () => {
                new CreateTemplateModal(this.app, CREATE_TEMPLATE_MODAL_OPTIONS).open();
            }
        });

        this.addCommand({
            id: "create-note",
            name: "Create a new note",
            callback: () => {
                new CreateNoteModal(this.app, CREATE_NOTE_MODAL_OPTIONS).open();
            }
        })
    }

    onunload() {
        this.SaveSettings().catch(console.error);
    }

    async LoadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async SaveSettings() {
        await this.saveData(this.settings);
    }
}