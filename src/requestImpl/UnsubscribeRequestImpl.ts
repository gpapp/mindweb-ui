import WebsocketService from "../app/service/WebsocketService";
import {UnsubscribeRequest} from "mindweb-request-classes/request/UnsubscribeRequest";
import {AbstractResponse} from "mindweb-request-classes/response/AbstractResponse";

export default class UnsubscribeRequestImpl extends UnsubscribeRequest {

    constructor(fileId: string) {
        super(fileId);
    }

    internalExecute(userId: string, websocketService: WebsocketService, next: (response: AbstractResponse) => void) {
        websocketService.sendMessage(this, next);
    }

}