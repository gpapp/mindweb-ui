import WebsocketService from "../app/service/WebsocketService";
import {SubscribeRequest} from "mindweb-request-classes/request/SubscribeRequest";
import {AbstractResponse} from "mindweb-request-classes/response/AbstractResponse";

export default class SubscribeRequestImpl extends SubscribeRequest {

    constructor(_fileId: string) {
        super(_fileId);
        this['name']=super.constructor.name;
    }

    internalExecute(userId: string, websocketService: WebsocketService, next: (response: AbstractResponse) => void) {
        websocketService.sendMessage(this, next);
    }

}