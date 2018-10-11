import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import {FilterService} from "../filter/filter.service";
import {KontextItem} from "../shared/kontextItem";


/**
 * The Json tree data in string. The data could be parsed into Json object
 */
const TREE_DATA = JSON.stringify({
  Applications: {
    Calendar: 'app',
    Chrome: 'app',
    Webstorm: 'app'
  },
  Documents: {
    angular: {
      src: {
        compiler: 'ts',
        core: 'ts'
      }
    },
    material2: {
      src: {
        button: 'ts',
        checkbox: 'ts',
        input: 'ts'
      }
    }
  },
  Downloads: {
    October: 'pdf',
    November: 'pdf',
    Tutorial: 'html'
  },
  Pictures: {
    'Photo Booth Library': {
      Contents: 'dir',
      Pictures: 'dir'
    },
    Sun: 'png',
    Woods: 'jpg'
  }
});

export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}



@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<any[]>([]);
  items: KontextItem[];
  dataObject: KontextItem[];

  get data(): KontextItem[] { return this.dataChange.value; }

  constructor(private filterService: FilterService) {
    this.initialize();
  }

  initialize() {
    // this.filterService.currentItems.subscribe(
    //   items =>{
    //     this.dataObject = items;
    //   }
    // );
    this.dataObject = JSON.parse(TREE_DATA);

    const data = this.buildFileTree(this.dataObject, 0);

    // // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `KontextItem`.
   */
  buildFileTree2(obj: any[], level: number): KontextItem[] {
    return obj.map(item => new KontextItem(item));
  }
  buildFileTree(obj: object, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
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



@Component({
  selector: 'app-tree-example',
  templateUrl: './tree-example.component.html',
  styleUrls: ['./tree-example.component.css'],
  providers: [FileDatabase],

})
export class TreeExampleComponent {
  nestedTreeControl: NestedTreeControl<KontextItem>;
  nestedDataSource: MatTreeNestedDataSource<KontextItem>;

  constructor(database: FileDatabase, private filterService: FilterService) {
    this.nestedTreeControl = new NestedTreeControl<KontextItem>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.filterService.currentItems.subscribe(
      items =>{
        this.nestedDataSource.data = database.buildFileTree2(items, 0);
      }
    );
  }

  hasNestedChild = (_: number, nodeData: KontextItem) => {
    if (nodeData.children){
      return nodeData.children.length > 0;
    } else{
      return false;
    }
  };

  private _getChildren = (node: KontextItem) => node.children;

  public log(){
    console.log("TREE-EXAMPLE-COMPONENT", this.nestedDataSource.data);
  }

  public expand(){
    let children = this.nestedTreeControl.getChildren(this.nestedDataSource.data[2]);
    this.nestedTreeControl.expand(this.nestedDataSource.data[2])

  }

}


