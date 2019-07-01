import {BehaviorSubject} from 'rxjs/index';
import {Injectable} from '@angular/core';
import {Node} from './source/node';

@Injectable()
export class MenuTreeService {
  dataChange = new BehaviorSubject<Node[]>([]);
  treeData = {
    'Home': 'home',
    'about': 'about',
    'course': 'course',
    'Angular4CRUD': 'person-list',
    'generalized-table': 'generalized-table',
    'Dictionary': {
      'sql': {
        'div-type': 'dictionary/sql/div-type',
        'table-filtering': 'dictionary/sql/table-filtering'
      },
      'pl/sql':{}
    }
  };

  constructor() {
    this.initialize();
  }

  get data(): Node[] {
    return this.dataChange.value;
  }

  initialize() {
    const data = this.buildFileTree(this.treeData, 0);
    this.dataChange.next(data);
  }

  private buildFileTree(obj: object, level: number): Node[] {
    return Object.keys(obj).reduce<Node[]>((accumulator, key) => {
      const value = obj[key];
      const node = new Node();

      node.name =
        // `sidenav.`
      `${key.split('').map(elem => elem.toLocaleLowerCase()).join('')}`; // creating string for ngx translate

      if (value !== null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
}
