import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
  declarations: [LandingPageComponent, CarouselComponent],
  imports: [CommonModule, LandingPageRoutingModule, NgbCarouselModule, CarouselModule],
})
export class LandingPageModule {}