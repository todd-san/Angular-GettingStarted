import { BrowserModule } from '@angular/platform-browser';
import {enableProdMode, NgModule} from '@angular/core';
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
import {MatButtonModule, MatIconModule, MatTreeModule} from "@angular/material";
import {ToastaModule} from 'ngx-toasta';
import { CrudComponent } from './crud/crud.component';
import { DetailsComponent } from './content/details/details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {ProjectCrudComponent} from "./crud/project-crud.component";
import { HomeComponent } from './content/home/home.component';
import {SpecDetailsComponent} from "./content/details/spec-details.component";
import {DesignDetailsComponent} from "./content/details/design-details.component";
import {PhaseDetailsComponent} from "./content/details/phase-details.component";
import {ProjectDetailsComponent} from "./content/details/project-details.component";
import {ConvertToSlashesPipe} from "./shared/convert-to-slashes.pipe";



enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    BaseComponent,
    ContentComponent,
    FilterComponent,
    HelpComponent,
    CrudComponent,
    ProjectCrudComponent,
    DetailsComponent,
    PageNotFoundComponent,
    HomeComponent,
    ProjectDetailsComponent,
    PhaseDetailsComponent,
    DesignDetailsComponent,
    SpecDetailsComponent,
    ConvertToSlashesPipe,
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
    ToastaModule.forRoot(),
    RouterModule.forRoot([
      // { path: 'details', component: DetailsComponent},
      { path: 'project/:id', component: ProjectDetailsComponent},
      { path: 'phase/:id', component: PhaseDetailsComponent},
      { path: 'design/:id', component: DesignDetailsComponent},
      { path: 'spec/:id', component: SpecDetailsComponent},
      { path: 'home', component: HomeComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: '**', component: PageNotFoundComponent}
        ], {useHash: true}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
