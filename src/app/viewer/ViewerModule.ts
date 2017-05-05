/**
 * Created by gpapp on 2017.03.26..
 */
import {NgModule} from "@angular/core";
import ViewerComponent from "./ViewerComponent";
import ViewerMenuComponent from "./ViewerMenuComponent";
import ViewerTreeComponent from "./ViewerTreeComponent";
import ViewerTaskComponent from "./ViewerTaskComponent";
import ViewerDetailComponent from "./ViewerDetailComponent";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {MaterialModule} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import ViewerMindmapComponent from "./ViewerMindmapComponent";
import {TreeModule} from "angular-tree-component";
import {Angular2FontawesomeModule} from "angular2-fontawesome/angular2-fontawesome";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MarkdownModule} from "angular2-markdown";
@NgModule({

    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        MaterialModule,
        NgbModule.forRoot(),
        BrowserAnimationsModule,
        Angular2FontawesomeModule,
        MarkdownModule.forRoot(),
        TreeModule
    ],
    declarations: [
        ViewerComponent,
        ViewerTreeComponent,
        ViewerTaskComponent,
        ViewerMindmapComponent,
        ViewerDetailComponent,
        ViewerMenuComponent,
    ]
})
export default class ViewerModule {

}
