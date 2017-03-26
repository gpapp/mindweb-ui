/**
 * Created by gpapp on 2017.03.15..
 */
import {Component, OnInit} from "@angular/core";
import {MapContainer} from "mindweb-request-classes";
import OpenMapService from "../service/OpenMapService";
@Component({
    selector: 'open-files',
    templateUrl: '/app/maps/OpenMapsTemplate.html'
})
export default class OpenMapsComponent {

    constructor(private openMapService: OpenMapService) {

    }

    mapOpen(mapId: string) {

    }

    mapClose(mapId: string) {
        this.openMapService.closeMap(mapId);
    }

}