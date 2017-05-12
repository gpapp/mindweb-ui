import {Component, OnInit} from "@angular/core";
import ViewerService from "../service/ViewerService";
import {ActivatedRoute, Params} from "@angular/router";
import ViewerComponent from "./ViewerComponent";
/**
 * Created by gpapp on 2017.03.26..
 */
@Component({
    selector: "viewer-task",
    templateUrl: "../../templates/viewer/ViewerTask.html"
})
export default class ViewerTaskComponent {
    constructor(private parent: ViewerComponent,
                private viewerService: ViewerService) {
    }

}
