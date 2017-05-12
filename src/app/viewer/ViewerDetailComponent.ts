import {Component, OnInit} from "@angular/core";
import ViewerComponent from "./ViewerComponent";
import ViewerService from "../service/ViewerService";
import {UserService} from "../service/UserService";
import MapNodeCore from "mindweb-request-classes/classes/MapNodeCore";
import {ActionNames} from "mindweb-request-classes/classes/EditAction";
import MapNode from "mindweb-request-classes/classes/MapNode";
/**
 * Created by gpapp on 2017.03.26..
 */
@Component({
    selector: "viewer-detail",
    templateUrl: "../../templates/viewer/ViewerDetail.html"
})
export default class ViewerDetailComponent implements OnInit {
    get showDetail(): boolean {
        return this._showDetail;
    }

    toggleShowDetail() {
        this._showDetail = !this._showDetail;
    }

    private _showDetail: boolean = true;

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

    onChange(event: any) {
        const node: MapNode = this.viewerService.currentNode as MapNode;

        let actionName: ActionNames;
        switch (event.srcElement.id) {
            case 'nodeText':
                actionName = ActionNames.nodeText;
                break;
            case 'detailText':
                actionName = ActionNames.nodeDetail;
                break;
            case 'noteText':
                actionName = ActionNames.nodeNote;
                break;
        }
        this.viewerService.sendEditAction(actionName, node.$['ID'], event.target.value);
    }

    moveIcon(index: number, direction: string) {
        const icons: MapNodeCore[] = Array.from(this.viewerService.currentNode.icon);
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
        this.viewerService.sendEditAction(ActionNames.nodeModifyIcons, this.viewerService.currentNode.$['ID'], icons);
    }

    deleteIcon(index: number) {
        const icons: MapNodeCore[] = Array.from(this.viewerService.currentNode.icon);
        icons.splice(index, 1);
        this.viewerService.sendEditAction(ActionNames.nodeModifyIcons, this.viewerService.currentNode.$['ID'], icons);
    }


}
