import {Component, OnInit} from "@angular/core";
import ViewerService from "../service/ViewerService";
import ViewerComponent from "./ViewerComponent";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs";
import MapNode from "mindweb-request-classes/classes/MapNode";
/**
 * Created by gpapp on 2017.03.26..
 */

export class MyTreeNode {

    public id: string;
    public name: string;
    public isExpanded: boolean;
    public children: MyTreeNode[] = [];

    constructor(public data: MapNode) {
        this.id = data.$['ID'];
        this.name = data.nodeMarkdown;
        this.isExpanded = data.open;
        this.data = data;
        this.children = [];
        if (data.node) {
            for (let n of data.node) {
                this.children.push(new MyTreeNode(n));
            }
        }
    }
}
@Component({
    selector: "viewer-tree",
    templateUrl: "/templates/viewer/ViewerTree.html"
})
export default class ViewerTreeComponent implements OnInit {
    private _treeModel: BehaviorSubject<MyTreeNode[]> = new BehaviorSubject([]);

    constructor(private parent: ViewerComponent,
                private viewerService: ViewerService) {
    }

    ngOnInit(): void {
        this.viewerService.currentMapVersion.subscribe((mapContent) => {
                let myTreeModel: MyTreeNode[];

                if (mapContent) {
                    myTreeModel = [new MyTreeNode(mapContent.content.rootNode)];
                } else {
                    myTreeModel = [new MyTreeNode(new MapNode({
                        node: [],
                        $: {ID: "0"},
                        open: false,
                        icon: [{$: {NAME: "loading"}}],
                        nodeMarkdown: "Loading...",
                        noteMarkdown: "",
                        detailMarkdown: "",
                        detailOpen: false,
                        attribute: []
                    }))];
                }
                this._treeModel.next(myTreeModel);
            }
        );
    }

    get treeModel(): Observable<MyTreeNode[]> {
        return this._treeModel.asObservable();
    }

    selectNode(node: MapNode) {
        this.parent.currentNode = node;
    }

}
