import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTicketComponent } from './components/admin-ticket/admin-ticket.component';
import { BookingPageComponent } from './components/bookingPage/bookingPage.component';

const routes: Routes = [
  { path: 'managetickets', component: AdminTicketComponent },
  { path: 'booking', component: BookingPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketRoutingModule {}
