import {Component, OnInit, ViewChild,} from '@angular/core';
import {MenuService} from "./menu.service";
import {ContextMenuService, ContextMenuComponent} from "ngx-contextmenu";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [MenuService,]
})

export class MenuComponent implements OnInit {
  items: any = [];
  filteredItems: any = [];
  errorMessage: string;
  private contextMenuService;

  @ViewChild('projectMenu') public projectMenu: ContextMenuComponent;
  @ViewChild('phaseMenu') public phaseMenu: ContextMenuComponent;
  @ViewChild('designMenu') public designMenu: ContextMenuComponent;
  @ViewChild('specMenu') public specMenu: ContextMenuComponent;


  constructor(private menuService: MenuService) {
    this.contextMenuService = ContextMenuService;
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({ event: $event, item: item });
    $event.preventDefault();
  }

  public showMessage(message: any, data?: any): void {
    console.log(message, data);
  }

  public log(message: any): void {
    console.log(message);
  }

  ngOnInit() {
    this.menuService.getMenu().subscribe(
      items => {
        this.items = items;
        this.filteredItems = this.items;
      },
      error => this.errorMessage = <any>error
    );
  }
}


