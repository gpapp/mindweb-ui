import { AfterViewInit, Component, ViewChild } from '@angular/core';
import ViewerService from '../service/ViewerService';
import ViewerComponent from './ViewerComponent';
import MapNode from 'mindweb-request-classes/classes/MapNode';
import { ActionNames } from 'mindweb-request-classes/classes/EditAction';
import { ITreeOptions, TreeComponent } from 'angular-tree-component';
import { ITreeModel, ITreeNode } from 'angular-tree-component/dist/defs/api';

/**
 * Created by gpapp on 2017.03.26..
 */

export class MyTreeNode extends MapNode {
    get id(): string {
        return this.$['ID'];
    }

    set id(newId: string) {
        this.$['ID'] = newId;
    }

    constructor(data: MapNode) {
        super(data);
        if (this.node) {
            const newNodes: MyTreeNode[] = [];
            for (let n of this.node) {
                newNodes.push(new MyTreeNode(n));
            }
            delete this.node;
            this.node = newNodes;
        }
    }
}

@Component({
    selector: 'viewer-tree',
    templateUrl: '../../templates/viewer/ViewerTree.html'
})
export default class ViewerTreeComponent implements AfterViewInit {
    @ViewChild(TreeComponent)
    private tree: TreeComponent;
    private _mapModel: MapNode[] = [];

    private _treeOptions: ITreeOptions = {
        displayField: 'nodeMarkdown',
        childrenField: 'node',
        isExpandedField: 'open',
        scrollOnSelect: true,
        allowDrag: true,
        useVirtualScroll: false,
    };

    get mapModel(): MapNode[] {
        return this._mapModel;
    }

    get treeOptions(): ITreeOptions {
        return this._treeOptions;
    }

    constructor(private parent: ViewerComponent,
                private viewerService: ViewerService) {
    }

    public ngAfterViewInit(): void {

        //Workaround using setTimeout for bug https://github.com/angular/angular/issues/17572
        this.viewerService.currentMapVersion.subscribe((mapContent) => setTimeout(() => {
                let myTreeModel: MyTreeNode[];

                if (mapContent) {
                    myTreeModel = [new MyTreeNode(mapContent.content.rootNode)];
                } else {
                    myTreeModel = [new MyTreeNode(new MapNode({
                        node: [],
                        $: {ID: '0'},
                        open: false,
                        icon: [{$: {NAME: 'loading'}}],
                        nodeMarkdown: 'Loading...',
                        noteMarkdown: '',
                        detailMarkdown: '',
                        detailOpen: false,
                        attribute: []
                    }))];
                }
                this._mapModel = myTreeModel;
                this.tree.treeModel.update();
            }, 0)
        );
    }

    public onTreeEvent(event: any) {
        const treeModel: ITreeModel = event.treeModel;
        const node: ITreeNode = event.node;
        switch (event.eventName) {
            case 'onInitialized':
                break;
            case 'onUpdateData':
                if (this.viewerService.currentNode) {
                } else {
                    treeModel.getVisibleRoots()[0].toggleActivated({multi: false});
                }
                // TODO MAKE IT RECURSIVE!
                for (let n of this.tree.treeModel.roots) {
                    this.checkExpanded(n, this.checkExpanded);
                }
                break;
            case 'onToggleExpanded':
                if (event.isExpanded == !node.data.open) {
                    this.viewerService.sendEditAction(ActionNames.nodeFold, node.data.id, event.isExpanded);
                }
                break;
            case 'onFocus':
                break;
            case 'onBlur':
                break;
            case 'onActivate':
                this.viewerService.currentNode = node.data as MyTreeNode;
                break;
            case 'onDeactivate':
                break;
            default:
                console.log(event);
        }
    }

    private checkExpanded(n: ITreeNode, fn: any): void {
        if (!n || !n.data) {
            return;
        }
        if (typeof n.isExpanded != 'undefined') {
            if (n.isExpanded == !n.data.open) {
                if (!n.isExpanded) {
                    n.expand();
                } else {
                    n.collapse();
                }
            }
        }
        if (n.hasChildren) {
            for (let sn of n.children) {
                fn(sn, fn);
            }
        }
    }

    public detailToggleOpen(node: MyTreeNode) {
        this.viewerService.sendEditAction(ActionNames.nodeDetailFold, node.id, !node.detailOpen);
    }
}
