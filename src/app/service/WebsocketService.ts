import {Injectable} from "@angular/core";
import {UUID} from "angular2-uuid";
import {MindwebService} from "mindweb-request-classes/service/MindwebService";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import ResponseFactory from "mindweb-request-classes/service/ResponseFactory";
import {AbstractRequest} from "mindweb-request-classes/request/AbstractRequest";
import {AbstractResponse} from "mindweb-request-classes/response/AbstractResponse";
import {AbstractMessage} from "mindweb-request-classes/classes/AbstractMessage";
/**
 * Created by gpapp on 2017.03.15..
 */

interface TwoWayMessage {
    data: AbstractRequest,
    callback: (response: AbstractResponse) => void
}

@Injectable()
export default class WebsocketService implements MindwebService {
    private registeredCallbacks: Map<string, (response: AbstractResponse) => void> = new Map();
    private handler: Subject<TwoWayMessage>;

    constructor() {

    }

    private connect(url: string): Subject<TwoWayMessage> {
        let ws = new WebSocket(url, 'mindweb-protocol');

        let observable = Observable.create(
            (obs: Observer<AbstractMessage>) => {
                ws.onmessage = obs.next.bind(obs);
                ws.onerror = obs.error.bind(obs);
                ws.onclose = obs.complete.bind(obs);

                return ws.close.bind(ws);
            });

        let observer = {
            next: (message: TwoWayMessage) => {

                switch (ws.readyState) {
                    case WebSocket.CONNECTING:
                    break;
                    case WebSocket.OPEN:
                        const correlationId = UUID.UUID();
                        message.data.correlationId = correlationId;
                        this.registeredCallbacks.set(correlationId, message.callback);
                        ws.send(JSON.stringify(message.data));
                        break;
                    case WebSocket.CLOSING:
                    case WebSocket.CLOSED:
                    default:
                        delete this.handler;
                }
            },
            complete: () => {
                delete this.handler;
            },
            error: () => {
                delete this.handler;
            }
        };

        observable.map((msg: MessageEvent) => {
            return ResponseFactory.create(msg.data)
        }).subscribe({
            next: (msg: AbstractMessage) => {
                if (msg instanceof AbstractResponse) {
                    const response: AbstractResponse = msg as AbstractResponse;
                    if (this.registeredCallbacks.has(response.correlationId)) {
                        const fn: (response: AbstractResponse) => void = this.registeredCallbacks.get(response.correlationId);
                        return fn(response);
                    }
                }
            },
            error: () => {

            },
            complete: () => {

            }
        });
        return Subject.create(observer, observable);
    }

    sendMessage(request: AbstractRequest, callback: (response: AbstractResponse) => void) {
        if (!this.handler) {
            this.handler = this.connect('ws://' + location.host + '/ws');
        }
        this.handler.next({data: request, callback: callback});
    }

}