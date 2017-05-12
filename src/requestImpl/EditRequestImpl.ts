import WebsocketService from "../app/service/WebsocketService";
import {AbstractResponse} from "mindweb-request-classes/response/AbstractResponse";
import EditAction from "mindweb-request-classes/classes/EditAction";
import {EditRequest} from "mindweb-request-classes/request/EditRequest";

export default class EditRequestImpl extends EditRequest {

    constructor(_fileId: string, _action: EditAction) {
        super(_fileId, _action);
        this['name'] = super.constructor.name;
    }

    internalExecute(userId: string, websocketService: WebsocketService, next: (response: AbstractResponse) => void) {
        websocketService.sendMessage(this, next);
    }

}