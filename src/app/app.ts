import {NgModule, OnInit} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {SidebarComponent} from "./layout/SidebarComponent";
import {HttpModule} from "@angular/http";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {UserService} from "./service/UserService";
import {LoginComponent} from "./login/LoginComponent";
import {PageNotFoundComponent} from "./not-found.component";
import {HomeComponent} from "./layout/HomeComponent";
import {TemplateComponent} from "./layout/TemplateComponent";
import {AboutComponent} from "./layout/AboutComponent";

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: '**', component: PageNotFoundComponent}
];
@NgModule({
    imports: [BrowserModule, HttpModule, RouterModule.forRoot(appRoutes), FormsModule],
    providers: [UserService],
    declarations: [PageNotFoundComponent, TemplateComponent, SidebarComponent, HomeComponent, AboutComponent, LoginComponent],
    bootstrap: [TemplateComponent]
})
export class AppModule implements OnInit {

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
    }
}

