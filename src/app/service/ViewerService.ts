/**
 * Created by gpapp on 2017.03.26..
 */
import {Injectable, OnDestroy, OnInit} from "@angular/core";
import WebsocketService, {BroadcastListener} from "./WebsocketService";
import {AbstractBroadcast} from "mindweb-request-classes/response/AbstractBroadcast";
import OpenMapService from "./OpenMapService";
import MapVersion from "mindweb-request-classes/classes/MapVersion";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import MapContainer from "mindweb-request-classes/classes/MapContainer";
import MapContent from "mindweb-request-classes/classes/MapContent";
@Injectable()
export default class ViewerService implements BroadcastListener, OnInit, OnDestroy {
    private _currentMapVersion: BehaviorSubject<MapVersion> = new BehaviorSubject(null);

    get currentMapVersion(): Observable<MapVersion> {
        return this._currentMapVersion.asObservable();
    }

    constructor(private openMapService: OpenMapService,
                private websocketService: WebsocketService) {

    }

    onMessage(broadcast: AbstractBroadcast): void {
        throw new Error('Method not implemented.');
    }

    ngOnInit(): void {
        this.websocketService.addBroadcastListener(this);
    }

    ngOnDestroy(): void {
        this.websocketService.removeBroadcastListener(this);
    }

    loadMap(mapId: string) {
        this.openMapService.openMap(mapId);
        this.openMapService.openMaps.subscribe(result => {
            for (let map of result) {
                if (map.container.id == mapId) {
                    map.container = Object.setPrototypeOf(map.container, new MapContainer());
                    map.content = Object.setPrototypeOf(map.content, new MapContent());
                    this._currentMapVersion.next(map);
                    break;
                }
            }
        });
    }

    get viewType(): string {
        if (this._currentMapVersion.value) {
            let viewType = this._currentMapVersion.value.content.rootNode.$['viewType'];
            return viewType ? viewType : 'tree'
        } else
            return 'tree';
    }
}