/**
 * Created by gpapp on 2017.03.26..
 */
import {Injectable} from "@angular/core";
import WebsocketService, {BroadcastListener} from "./WebsocketService";
import {AbstractBroadcast} from "mindweb-request-classes/response/AbstractBroadcast";
import OpenMapService from "./OpenMapService";
import MapVersion from "mindweb-request-classes/classes/MapVersion";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import MapContainer from "mindweb-request-classes/classes/MapContainer";
import MapContent from "mindweb-request-classes/classes/MapContent";
import EditAction, {ActionNames} from "mindweb-request-classes/classes/EditAction";
import EditResponse from "mindweb-request-classes/response/EditResponse";
import EditRequestImpl from "../../requestImpl/EditRequestImpl";
import MapService from "mindweb-request-classes/service/MapService";
import {AbstractMessage} from "mindweb-request-classes/classes/AbstractMessage";
import {AbstractResponse} from "mindweb-request-classes/response/AbstractResponse";
import MapNode from "mindweb-request-classes/classes/MapNode";
import NullResponse from "mindweb-request-classes/response/NullResponse";
@Injectable()
export default class ViewerService implements BroadcastListener {
    private _currentMapVersion: BehaviorSubject<MapVersion> = new BehaviorSubject(null);
    private _currentNode: MapNode;

    get currentMapVersion(): Observable<MapVersion> {
        return this._currentMapVersion.asObservable();
    }

    get currentNode(): MapNode {
        return this._currentNode;
    }

    set currentNode(value: MapNode) {
        this._currentNode = value;
    }

    constructor(private openMapService: OpenMapService,
                private websocketService: WebsocketService) {
        this.websocketService.addBroadcastListener(this);
    }

    onMessage(message: AbstractMessage): void {
        if (message instanceof AbstractBroadcast) {
            const broadcast: AbstractBroadcast = message as AbstractBroadcast;
        } else {
            const response: AbstractResponse = message as AbstractResponse;
            if (response instanceof EditResponse) {
                MapService.applyAction(this._currentMapVersion.value.content, response.action, (error) => {
                    if (error) {
                        //TODO: handle error
                        return;
                    }
                    this._currentMapVersion.next(this._currentMapVersion.value);
                    if (this._currentNode) {
                        this._currentNode = this.getNodeById(this._currentNode.$['ID'])
                    }
                });
            }
        }
    }


    loadMap(mapId: string) {
        this._currentMapVersion.next(null);
        delete this._currentNode;
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

    getNodeById(id: string) {
        return MapService.findNodeById(this._currentMapVersion.value.content.rootNode, id);
    }

    sendEditAction(event: ActionNames, id: string, payload: any) {
        const editAction = new EditAction();
        editAction.parent = id;
        editAction.event = event;
        editAction.payload = payload;
        this.websocketService.sendMessage(new EditRequestImpl(this._currentMapVersion.value.container.id, editAction), (response: NullResponse) => {

        });
    }
}