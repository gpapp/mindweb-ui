/**
 * Created by gpapp on 2017.02.20..
 */
import {Component, OnInit} from "@angular/core";
import {UserService} from "../service/UserService";
import User from "../classes/User";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
@Component({
    providers: [UserService],
    selector: "main-app",
    templateUrl: "/app/layout/template.html"
})
export class TemplateComponent implements OnInit {
    get loading(): boolean {
        return this._loading;
    }

    get infoMsg(): string {
        return this._infoMsg;
    }

    set infoMsg(value: string) {
        this._infoMsg = value;
    }

    get errorMsg(): string {
        return this._errorMsg;
    }

    set errorMsg(value: string) {
        this._errorMsg = value;
    }

    get currentUser(): User {
        return this._currentUser;
    }

    private _infoMsg: string;
    private _errorMsg: string;
    private _loading: boolean = true;
    private _currentUser: User;

    constructor(private userService: UserService, private modalService: NgbModal) {

    }

    ngOnInit(): void {
        this.userService.lookupPromise().then(
            user => {
                this._loading = false;
                return this._currentUser = user
            },
            error => {
                this._loading = false;
                this._errorMsg = error;
            });
    }

    open(content) {
        this.modalService.open(content).result.then((result) => {
        }, (reason) => {
        });
    }

    logout() {
        this._loading = true;
        this.userService.logoutPromise().then(
            user => {
                this._loading = false;
                delete  this._currentUser;
            },
            error => {
                this._loading = false;
                this._errorMsg = error;
            });
    }

}