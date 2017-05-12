/**
 * Created by gpapp on 2017.03.15..
 */
import {Component} from "@angular/core";
import OpenMapService from "../service/OpenMapService";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
    selector: 'open-files',
    template: `
        <div class="indent">
            <div *ngFor="let item of openMapService.openMaps | async">
                <span (click)="gotoMap(item.container.id)"><fa name="file" size="2" fw="true"></fa>{{item.container.name}}</span>
                <span class="pull-right">
                    <i class="fa fa-close " (click)="mapClose(item.container.id)"></i>
                    <i class="fa fa-chevron-right"></i>
                </span>
            </div>
        </div>`
})
export default class OpenMapsComponent {

    constructor(private route: ActivatedRoute,
                private openMapService: OpenMapService,
                private router: Router) {

    }

    gotoMap(mapId: string) {
        this.router.navigate(['viewer', mapId]);
    }

    mapClose(mapId: string) {
        this.openMapService.closeMap(mapId);
        this.router.navigate(['maps']);
    }

}