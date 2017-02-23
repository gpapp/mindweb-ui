/**
 * Created by gpapp on 2017.02.20..
 */
import {Component, OnInit} from "@angular/core";
import {UserService} from "../service/UserService";
import User from "../classes/User";
@Component({
    providers: [UserService],
    selector: "main-app",
    templateUrl: "/app/layout/template.html"
})
export class TemplateComponent implements OnInit{
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

    get sidebarDisplay(): boolean {
        return this._sidebarDisplay;
    }

    set sidebarDisplay(value: boolean) {
        this._sidebarDisplay = value;
    }

    get loginRequired(): boolean {
        return this._loginRequired;
    }

    set loginRequired(value: boolean) {
        this._loginRequired = value;
    }


    private _infoMsg: string;
    private _errorMsg: string;

    private _currentUser: User;
    private _sidebarDisplay: boolean = true;
    private _loginRequired: boolean = false;

    constructor(private userService: UserService) {

    }

    ngOnInit(): void {
        this.userService.lookup().then(
            user => this._currentUser = user,
            error => this._errorMsg = error);
    }

    logout() {
        this.userService.logout().then(
            user => this._currentUser = user,
            error => this._errorMsg = error
        );
    }

    toggleSidebar() {
        this._sidebarDisplay = !this._sidebarDisplay;
    }
}