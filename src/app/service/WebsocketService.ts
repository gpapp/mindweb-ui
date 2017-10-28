import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { MindwebService } from 'mindweb-request-classes/service/MindwebService';
import ResponseFactory from 'mindweb-request-classes/service/ResponseFactory';
import { AbstractRequest } from 'mindweb-request-classes/request/AbstractRequest';
import { AbstractResponse } from 'mindweb-request-classes/response/AbstractResponse';
import { AbstractMessage } from 'mindweb-request-classes/classes/AbstractMessage';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AbstractBroadcast } from 'mindweb-request-classes/response/AbstractBroadcast';

/**
 * Created by gpapp on 2017.03.15..
 */

export interface BroadcastListener {
    onMessage(broadcast: AbstractBroadcast): void;
}

interface TwoWayMessage {
    data: AbstractRequest,
    callback: (response: AbstractResponse) => void
}

@Injectable()
export default class WebsocketService implements MindwebService {
    private registeredBroadcastListeners: Set<BroadcastListener> = new Set();
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
        // Send message
        let observer: Observer<TwoWayMessage> = {
            next: (message: TwoWayMessage) => {

                switch (ws.readyState) {
                    case WebSocket.CONNECTING:
                        setTimeout(observer.next, 500, message);
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
            error: (error) => {
                console.error(error);
                delete this.handler;
            }
        };
        // Receive response
        observable.map((msg: MessageEvent) => {
            return ResponseFactory.create(msg.data)
        }).subscribe({
            next: (msg: AbstractMessage) => {
                if (msg instanceof AbstractResponse) {
                    const response: AbstractResponse = msg as AbstractResponse;
                    if (this.registeredCallbacks.has(response.correlationId)) {
                        const fn: (response: AbstractResponse) => void =
                            this.registeredCallbacks.get(response.correlationId);
                        this.registeredCallbacks.delete(response.correlationId);
                        return fn(response);
                    } else {
                        // If callback is not found try to process as a broadcast
                        for (let bcl of this.registeredBroadcastListeners) {
                            bcl.onMessage(msg);
                        }
                    }
                } else if (msg instanceof AbstractBroadcast) {
                    for (let bcl of this.registeredBroadcastListeners) {
                        bcl.onMessage(msg);
                    }
                }
            },
            error: (error: any) => {
                console.error(error);
                ws.close();
                delete this.handler;
            },
            complete: () => {
                ws.close();
                delete this.handler;
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

    addBroadcastListener(listener: BroadcastListener) {
        if (this.registeredBroadcastListeners.has(listener)) {
            return;
        }
        this.registeredBroadcastListeners.add(listener);
    }

    removeBroadcastListener(listener: BroadcastListener) {
        if (!this.registeredBroadcastListeners.has(listener)) {
            return;
        }
        this.registeredBroadcastListeners.delete(listener);
    }
}
