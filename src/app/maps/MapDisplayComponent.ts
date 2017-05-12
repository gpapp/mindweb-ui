import {Component, Input, TemplateRef, ElementRef} from "@angular/core";
import MapContainer from "mindweb-request-classes/classes/MapContainer";
import {MapListComponent} from "./MapListComponent";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MapService} from "../service/MapService";
import {TemplateComponent} from "../layout/TemplateComponent";
@Component({
    selector: 'file-item',
    templateUrl: "../../templates/maps/MapDisplay.html"
})
export class MapDisplayComponent {
    infoPopup: boolean = false;
    hovered: boolean = false;

    @Input() item: MapContainer;
    @Input() deleteFileDialog: TemplateRef<ElementRef>;
    @Input() renameFileDialog: TemplateRef<ElementRef>;
    @Input() shareFileDialog: TemplateRef<ElementRef>;

    constructor(private fileService: MapService,
                private modalService: NgbModal,
                private root: TemplateComponent,
                private parent: MapListComponent) {
    }

    exportFreeplane() {
        const name = this.item.name;
        this.fileService.exportFreeplane(this.item.id.toString()).then(
            function (data) {
                const blob = new Blob([data.text()], {type: 'application/x-freemind'});
                const url = window.URL.createObjectURL(blob, {oneTimeOnly: true});
                const tempLink = document.createElement('a');
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
            let promise: Promise<MapContainer>;
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