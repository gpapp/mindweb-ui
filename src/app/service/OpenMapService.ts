import {Injectable} from '@angular/core';
import {AbstractResponse, MapContainer} from 'mindweb-request-classes';
import WebsocketService from './WebsocketService';
import SubscribeRequestImpl from '../../requestImpl/SubscribeRequestImpl';
import UnsubscribeRequestImpl from '../../requestImpl/UnsubscribeRequestImpl';
import SubscribeResponse from 'mindweb-request-classes/response/SubscribeResponse';
import UnsubscribeResponse from 'mindweb-request-classes/response/UnsubscribeResponse';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import MapVersion from 'mindweb-request-classes/classes/MapVersion';
/**
 * Created by gpapp on 2017.03.15..
 */
@Injectable()
export default class OpenMapService {
    private _openMapStore: Map<string, MapVersion> = new Map();
    private _openMaps: BehaviorSubject<MapVersion[]> = new BehaviorSubject([]);

    constructor(private websocketService: WebsocketService) {
    }

    get openMaps(): Observable<MapVersion[]> {
        return this._openMaps.asObservable();
    }

    openMap(fileId: string) {
        if (this._openMapStore.has(fileId))
            return;
        this.websocketService.sendMessage(new SubscribeRequestImpl(fileId), (response: AbstractResponse) => {
            const s: SubscribeResponse = response as SubscribeResponse;
            this._openMapStore.set(s.mapVersion.container.id, s.mapVersion);
            this._openMaps.next(Array.from(this._openMapStore.values()));
        });
    }

    closeMap(fileId: string) {
        if (!this._openMapStore.has(fileId))
            return;
        this.websocketService.sendMessage(new UnsubscribeRequestImpl(fileId), (response: AbstractResponse) => {
            const s: UnsubscribeResponse = response as UnsubscribeResponse;
            this._openMapStore.delete(fileId);
            this._openMaps.next(Array.from(this._openMapStore.values()));
        });

    }

    closeAll() {
        this._openMapStore.forEach((value: MapVersion, key: string) => {
            this.closeMap(key)
        });
    }
}
