import {FlatTreeControl} from '@angular/cdk/tree';
import {Component} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {Observable, of as observableOf} from 'rxjs';
import {FlatNode} from '../source/flat-node';
import {Node} from '../source/node';
import {TranslateService} from '@ngx-translate/core';
import {MenuTreeService} from '../menu-tree.service';

@Component({
  selector: 'app-menu-tree',
  templateUrl: './menu-tree.component.html',
  styleUrls: ['./menu-tree.component.css'],
})
export class MenuTreeComponent {
  treeControl: FlatTreeControl<FlatNode>;
  treeFlattener: MatTreeFlattener<Node, FlatNode>;
  dataSource: MatTreeFlatDataSource<Node, FlatNode>;
  activeNode: Node | null;

  constructor(
    // private translate: TranslateService,
    private menuTreeService: MenuTreeService
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    // this.translate.setDefaultLang('ukr');
    this.treeControl = new FlatTreeControl<FlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.menuTreeService.dataChange.subscribe(data => this.dataSource.data = data);
  }

  transformer = (node: Node, level: number) => {
    return new FlatNode(!!node.children, node.name, level, node.type);
  };

  hasChild = (_: number, nodeData: FlatNode) => nodeData.expandable;

  private getLevel = (node: FlatNode) => node.level;

  private isExpandable = (node: FlatNode) => node.expandable;

  private getChildren = (node: Node): Observable<Node[]> => observableOf(node.children);


}
