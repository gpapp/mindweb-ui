/**
 * Created by gpapp on 2017.03.15..
 */
import {Component} from "@angular/core";
import OpenMapService from "../service/OpenMapService";
@Component({
    selector: 'open-files',
    templateUrl: '/app/maps/OpenMapsTemplate.html'
})
export default class OpenMapsComponent {
    constructor(private openMapService: OpenMapService) {

    }

    get openMaps() {
        return this.openMapService.openMaps;
    }
}