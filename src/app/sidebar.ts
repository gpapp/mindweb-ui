import {Component} from "@angular/core";
import {FileService} from "./service/fileService";
/**
 * Created by gpapp on 2017.02.19..
 */
@Component({
    providers: [FileService],
    selector: 'sidebar',
    templateUrl: 'app/sidebar.html'
})
export class SidebarComponent {
    constructor(private fileService:FileService){

    }
    get openFiles (){
        return this.fileService.openFiles.entries();
    }

}
