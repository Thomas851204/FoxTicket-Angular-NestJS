import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TicketRoutingModule } from './ticket-routing.module';
import { AdminTicketComponent } from './components/admin-ticket/admin-ticket.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BookingPageComponent } from './components/bookingPage/bookingPage.component';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { ManageTicketsComponent } from './components/manage-tickets/manage-tickets.component';
import { NewTicketsComponent } from './components/new-tickets/new-tickets.component';

@NgModule({
  declarations: [
    AdminTicketComponent,
    BookingPageComponent,
    ManageTicketsComponent,
    NewTicketsComponent,
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatChipsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatMomentDateModule,
    MatIconModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class TicketModule {}
