import {Component, OnInit} from "@angular/core";
import {HomeComponent} from "../layout/HomeComponent";
import ViewerComponent from "./ViewerComponent";
import ViewerService from "../service/ViewerService";
import {UserService} from "../service/UserService";
import MapNodeCore from "mindweb-request-classes/classes/MapNodeCore";
/**
 * Created by gpapp on 2017.03.26..
 */
@Component({
    selector: "viewer-detail",
    templateUrl: "/templates/viewer/ViewerDetail.html"
})
export default class ViewerDetailComponent implements OnInit {

    private _editable: boolean = false;

    constructor(private parent: ViewerComponent,
                private viewerService: ViewerService,
                private userService: UserService) {
    }

    ngOnInit(): void {
        this.viewerService.currentMapVersion.subscribe(map => {
            if (map)
            this._editable = map.container.canEdit(this.userService.currentUser.id)
        });
    }

    get editable(): boolean {
        return this._editable;

    }

    moveIcon(index: number, direction: string) {
        const icons: MapNodeCore[] = this.parent.currentNode.icon;
        switch (direction) {
            case 'left':
                if (!index) return;
            {
                const tmp = icons[index - 1];
                icons[index - 1] = icons[index];
                icons[index] = tmp;
            }
                break;
            case 'right':
                if (index == icons.length - 1) return;
            {
                const tmp = icons[index + 1];
                icons[index + 1] = icons[index];
                icons[index] = tmp;

            }
                break;
        }
    }

    deleteIcon(index: number) {
        const icons: MapNodeCore[] = this.parent.currentNode.icon;
        icons.splice(index, 1);
    }

}
