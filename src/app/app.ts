import {NgModule, OnInit} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {UserService} from "./service/UserService";
import {PageNotFoundComponent} from "./not-found.component";
import {HomeComponent} from "./layout/HomeComponent";
import {FilesComponent} from "./files/FilesComponent";
import {TemplateComponent} from "./layout/TemplateComponent";
import {AboutComponent} from "./layout/AboutComponent";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MaterialModule} from "@angular/material";
import {Angular2FontawesomeModule} from "angular2-fontawesome/angular2-fontawesome";
import {FileDisplayComponent} from "./files/FileDisplayComponent";
import {AuthGuard} from "./layout/AuthGuard";
import {UploadComponent} from "./files/UploadComponent";

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'files', component: FilesComponent, canActivate: [AuthGuard]},
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
    providers: [UserService, AuthGuard],
    declarations: [PageNotFoundComponent,
        TemplateComponent,
        FilesComponent,
        FileDisplayComponent,
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

