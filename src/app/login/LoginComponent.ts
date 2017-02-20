import {Component, OnInit, Host} from "@angular/core";
import {TemplateComponent} from "../layout/TemplateComponent";
/**
 * Created by gpapp on 2017.02.20..
 */

@Component({
    selector: 'login-form',
    templateUrl: '/app/login/login.html'
})
export class LoginComponent implements OnInit {
    constructor(@Host() private parent: TemplateComponent) {
    }

    ngOnInit(): void {
    }
}

