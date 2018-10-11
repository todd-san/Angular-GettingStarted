import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { BaseComponent } from './base/base.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ContentComponent } from './content/content.component';
import { ContextMenuModule } from "ngx-contextmenu";
import { FilterComponent } from './filter/filter.component';
import { HelpComponent } from './help/help.component';
import {MenuService} from "./menu/menu.service";
import {FilterService} from "./filter/filter.service";
import {MatButtonModule, MatIconModule, MatTreeModule} from "@angular/material";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    BaseComponent,
    ContentComponent,
    FilterComponent,
    HelpComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ContextMenuModule.forRoot({
      autoFocus: true,
      // useBootstrap4: true,
    }),
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    // RouterModule.forRoot([
    //   {
    //     path: 'two',
    //     component: ChildTwoComponent,
    //   },
    //   {
    //     path: '**',
    //     component: ChildOneComponent,
    //   }
    // ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
