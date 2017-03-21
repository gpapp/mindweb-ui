import {Injectable} from "@angular/core";
import {AbstractResponse, MapContainer} from "mindweb-request-classes";
import WebsocketService from "./WebsocketService";
import SubscribeRequestImpl from "../../requestImpl/SubscribeRequestImpl";
import UnsubscribeRequestImpl from "../../requestImpl/UnsubscribeRequestImpl";
import SubscribeResponse from "mindweb-request-classes/response/SubscribeResponse";
import UnsubscribeResponse from "mindweb-request-classes/response/UnsubscribeResponse";
/**
 * Created by gpapp on 2017.03.15..
 */
@Injectable()
export default class OpenMapService {

    private _openMaps: Map<string,MapContainer> = new Map();

    constructor(private websocketService: WebsocketService) {
    }

    get openMaps(): Map<string, MapContainer> {
        return this._openMaps;
    }

    openFile(fileId: string) {
        if (this._openMaps.has(fileId))
            return;
        this.websocketService.sendMessage(new SubscribeRequestImpl(fileId), (response: AbstractResponse) => {
            const s: SubscribeResponse = response as SubscribeResponse;
            this._openMaps.set(s.mapContainer.id, s.mapContainer);
        });
    }

    closeFile(fileId: string) {
        if (!this._openMaps.has(fileId))
            return;
        const curFile: MapContainer = this._openMaps.get(fileId);
        this.websocketService.sendMessage(new UnsubscribeRequestImpl(fileId), (response: AbstractResponse) => {
            const s: UnsubscribeResponse = response as UnsubscribeResponse;
            this._openMaps.delete(s.mapContainer.id);
        });

    }
}
