import { BrowserModule } from '@angular/platform-browser';
import { enableProdMode, NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ContextMenuModule } from "ngx-contextmenu";
import { ToastaModule } from 'ngx-toasta';
import { MatButtonModule, MatIconModule, MatTreeModule } from "@angular/material";

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BaseComponent } from './base/base.component';
import { ContentComponent } from './content/content.component';
import { FilterComponent } from './filter/filter.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './content/home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { DesignDetailsComponent } from "./content/details/design-details.component";
import { SpecDetailsComponent } from "./content/details/spec-details.component";
import { PhaseDetailsComponent } from "./content/details/phase-details.component";
import { ProjectDetailsComponent } from "./content/details/project-details.component";

import { CrudComponent } from './crud/crud.component';
import { ProjectCrudComponent } from "./crud/project-crud.component";
import { PhaseCrudComponent } from "./crud/phase-crud.component";
import { DesignCrudComponent } from "./crud/design-crud.component";
import { SpecCrudComponent } from "./crud/spec-crud.component";

import {ConvertToSlashesPipe} from "./shared/convert-to-slashes.pipe";
import { LoginComponent } from './login/login.component';
import { ProjectTreeComponent } from './project-tree/project-tree.component';
import { NavComponent } from './nav/nav.component';


enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BaseComponent,
    ContentComponent,
    FilterComponent,
    HelpComponent,
    CrudComponent,
    ProjectCrudComponent,
    PhaseCrudComponent,
    DesignCrudComponent,
    SpecCrudComponent,
    PageNotFoundComponent,
    HomeComponent,
    ProjectDetailsComponent,
    PhaseDetailsComponent,
    DesignDetailsComponent,
    SpecDetailsComponent,
    ConvertToSlashesPipe,
    LoginComponent,
    ProjectTreeComponent,
    NavComponent,
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
      { path: 'project/:id', component: ProjectDetailsComponent},
      { path: 'phase/:id', component: PhaseDetailsComponent},
      { path: 'design/:id', component: DesignDetailsComponent},
      { path: 'spec/:id', component: SpecDetailsComponent},
      { path: 'home', component: HomeComponent},
      { path: 'login', component: LoginComponent},
      { path: '', redirectTo: 'login', pathMatch: 'full'},
      { path: '**', component: PageNotFoundComponent}
        ], {useHash: true}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
