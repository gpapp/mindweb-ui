import {NgModule, OnInit} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {UserService} from "./service/UserService";
import {PageNotFoundComponent} from "./not-found.component";
import {HomeComponent} from "./layout/HomeComponent";
import {MapListComponent} from "./maps/MapListComponent";
import {TemplateComponent} from "./layout/TemplateComponent";
import {AboutComponent} from "./layout/AboutComponent";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MaterialModule} from "@angular/material";
import {Angular2FontawesomeModule} from "angular2-fontawesome/angular2-fontawesome";
import {MapDisplayComponent} from "./maps/MapDisplayComponent";
import {AuthGuard} from "./layout/AuthGuard";
import {UploadComponent} from "./maps/UploadComponent";
import OpenMapsComponent from "./maps/OpenMapsComponent";
import OpenMapModule from "./service/OpenMapService";
import WebsocketService from "./service/WebsocketService";
import OpenMapService from "./service/OpenMapService";

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'maps', component: MapListComponent, canActivate: [AuthGuard]},
    {path: 'about', component: AboutComponent},
    {path: '**', component: PageNotFoundComponent}
];
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(appRoutes),
        FormsModule,
        MaterialModule,
        NgbModule.forRoot(),
        Angular2FontawesomeModule],
    providers: [UserService, WebsocketService, OpenMapService, AuthGuard],
    declarations: [PageNotFoundComponent,
        TemplateComponent,
        MapListComponent,
        OpenMapsComponent,
        MapDisplayComponent,
        HomeComponent,
        AboutComponent,
        UploadComponent],

    bootstrap: [TemplateComponent]
})
export class AppModule implements OnInit {

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
    }
}

