import { NgModule, OnInit } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { UserService } from "./service/UserService";
import { PageNotFoundComponent } from "./not-found.component";
import { HomeComponent } from "./layout/HomeComponent";
import { MapListComponent } from "./maps/MapListComponent";
import { TemplateComponent } from "./layout/TemplateComponent";
import { AboutComponent } from "./layout/AboutComponent";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "@angular/material";
import { Angular2FontawesomeModule } from "angular2-fontawesome/angular2-fontawesome";
import { MapDisplayComponent } from "./maps/MapDisplayComponent";
import { AuthGuard } from "./layout/AuthGuard";
import { UploadComponent } from "./maps/UploadComponent";
import OpenMapsComponent from "./maps/OpenMapsComponent";
import OpenMapService from "./service/OpenMapService";
import WebsocketService from "./service/WebsocketService";
import ViewerService from "./service/ViewerService";
import ViewerMenuComponent from "./viewer/ViewerMenuComponent";
import ViewerComponent from "./viewer/ViewerComponent";
import ViewerModule from "./viewer/ViewerModule";

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'maps', component: MapListComponent, canActivate: [AuthGuard]},
    {
        path: 'viewer/:mapId', component: ViewerComponent, children: [
        {path: 'menu', component: ViewerMenuComponent, outlet: 'local-menu'}]
    },
    {path: '**', component: PageNotFoundComponent}
];
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(appRoutes),
        FormsModule,
        NgbModule.forRoot(),
        MaterialModule,
        Angular2FontawesomeModule,
        ViewerModule],
    providers: [UserService,
        WebsocketService,
        OpenMapService,
        ViewerService,
        AuthGuard],
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

