import {Component, Host} from "@angular/core";
import {FileService} from "../service/FileService";
import {TemplateComponent} from "./TemplateComponent";
/**
 * Created by gpapp on 2017.02.19..
 */
@Component({
    providers: [FileService],
    selector: 'sidebar',
    templateUrl: '/app/layout/sidebar.html'
})
export class SidebarComponent {

    get openFiles() {
        return this.fileService.openFiles.entries();
    }

    constructor(private fileService: FileService, @Host() private parent: TemplateComponent) {
    }

}
