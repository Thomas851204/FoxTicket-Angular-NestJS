import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundRoutingModule } from './components/page-not-found/page-not-found-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { PageNotFoundComponent } from './page-not-found.component';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule, PageNotFoundRoutingModule, MatButtonModule],
})
export class PageNotFoundModule {}
