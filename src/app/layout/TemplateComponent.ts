/**
 * Created by gpapp on 2017.02.20..
 */
import {Component, OnInit, TemplateRef} from "@angular/core";
import {UserService} from "../service/UserService";
import User from "mindweb-request-classes/dist/classes/User";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
@Component({
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
        return this.userService.currentUser;
    }

    private _infoMsg: string;
    private _errorMsg: string;
    private _loading: boolean = true;

    constructor(private userService: UserService, private modalService: NgbModal, private router: Router, private location: Location) {

    }

    ngOnInit(): void {
        this.userService.lookupPromise().then(
            user => {
                this._loading = false;
            },
            error => {
                this._loading = false;
                this._errorMsg = error;
            });
    }

    open(dialog: TemplateRef<any>) {
        this.modalService.open(dialog).result.then((result) => {
        }, (reason) => {
        });
    }

    logout() {
        this._loading = true;
        this.userService.logoutPromise().then(
            user => {
                this._loading = false;
                this.location.replaceState("/");
                this.router.navigate(['']);
            },
            error => {
                this._loading = false;
                this._errorMsg = error;
            });
    }

}