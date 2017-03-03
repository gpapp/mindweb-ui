import {Component, Input, TemplateRef, ElementRef} from "@angular/core";
import File from "mindweb-request-classes/dist/classes/File";
import {FilesComponent} from "./FilesComponent";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FileService} from "../service/FileService";
import {TemplateComponent} from "../layout/TemplateComponent";
@Component({
    selector: 'file-item',
    templateUrl: "/app/files/fileDisplay.html"
})
export class FileDisplayComponent {
    infoPopup: boolean = false;
    hovered: boolean = false;

    @Input() item: File;
    @Input() deleteFileDialog: TemplateRef<ElementRef>;
    @Input() renameFileDialog: TemplateRef<ElementRef>;
    @Input() shareFileDialog: TemplateRef<ElementRef>;

    constructor(private fileService: FileService,
                private modalService: NgbModal,
                private root: TemplateComponent,
                private parent: FilesComponent) {
    }

    exportFreeplane() {
        const name = this.item.name;
        this.fileService.exportFreeplane(this.item.id.toString()).then(
            function (data) {
                var blob = new Blob([data.text()], {type: 'application/x-freemind'});
                var url = window.URL.createObjectURL(blob, {oneTimeOnly: true});
                var tempLink = document.createElement('a');
                document.body.appendChild(tempLink);
                tempLink.href = url;
                tempLink.setAttribute('download', name);
                tempLink.click();
                document.body.removeChild(tempLink);
            },
            function (error) {
                alert("Cannot save file:" + error);
            }
        )
    }

    open(command: string, dialog: TemplateRef<any>) {
        this.parent.target = this.item;
        this.modalService.open(dialog, {size: 'lg'}).result.then((result) => {
            let promise: Promise<File>;
            switch (command) {
                case 'share':
                    promise = this.fileService.share(result.id,
                        result['newIsShareable'],
                        result['newIsPublic'],
                        result['newViewers'],
                        result['newEditors']);
                    break;
                case 'rename':
                    promise = this.fileService.rename(result.id,
                        result['newName']);
                    break;
                case 'delete':
                    promise = this.fileService.deleteFile(result.id);
                    break;
            }
            promise.then(() => {
                this.parent.refreshFiles();
            }).catch((error) => {
                this.root.errorMsg = error;
            })
        }, (reason) => {
        });
    }
}