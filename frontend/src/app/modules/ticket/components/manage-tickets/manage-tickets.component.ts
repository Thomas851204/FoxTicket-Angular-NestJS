import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { dbTicket } from 'src/app/shared/models/dbTicket.interface';
import { TicketService } from '../../services/ticket.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { updatedDbTicket } from 'src/app/shared/models/updatedDbTicket.interface';
import { AdminTicket } from 'src/app/shared/models/adminTicket.interface';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-manage-tickets',
  templateUrl: './manage-tickets.component.html',
  styleUrls: ['./manage-tickets.component.scss'],
})
export class ManageTicketsComponent implements OnInit {
  ticketDataSource = new MatTableDataSource<any>([]);
  initialTicketData: dbTicket[] = [];

  manageTabForm!: FormGroup;

  @ViewChild('checkbox', { static: false }) checkbox: MatCheckbox;
  @ViewChild(MatTable) table: MatTable<any>;

  ManageTabColumns: string[] = [
    'select',
    'movieID',
    'title',
    'price',
    'numOfTickets',
    'screeningTimes',
    'modify',
  ];

  constructor(
    private ticketService: TicketService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ticketService.getTickets().subscribe({
      next: (response: AdminTicket[]) => {
        const ticketList: dbTicket[] = response.map((ticket: AdminTicket) => {
          return {
            select: false,
            movieID: ticket.movieId,
            title: ticket.title,
            price: ticket.price,
            numOfTickets: ticket.numOfTickets,
            screeningTimes: ticket.screeningTimes.split(','),
          };
        });
        this.initialTicketData = ticketList;
        this.createFormGroup(ticketList);
      },
    });
  }

  createFormGroup(ticketList: dbTicket[]): void {
    const tableRows = this.formBuilder.array(
      ticketList.map((ticket: dbTicket) => {
        return this.formBuilder.group({
          select: [false],
          movieID: [{ value: ticket.movieID, disabled: true }],
          title: [{ value: ticket.title, disabled: true }],
          price: [{ value: ticket.price, disabled: true }],
          numOfTickets: [{ value: ticket.numOfTickets, disabled: true }],
          screeningTimes: [ticket.screeningTimes],
        });
      })
    );

    this.manageTabForm = this.formBuilder.group({
      tableRows: tableRows,
    });

    this.ticketDataSource.data = this.tableRowsArray;
  }

  addNewScreeningTime(
    event: MatDatepickerInputEvent<Date>,
    formGroup: FormGroup
  ): void {
    const newDate: string = `${event.value?.toISOString()}`;
    const screeningTimes = [...formGroup.value.screeningTimes];
    if (!screeningTimes.includes(newDate)) {
      screeningTimes.push(newDate);
    }
    formGroup.patchValue({
      screeningTimes: screeningTimes,
    });
  }

  removeScreeningTime(index: number, formGroup: FormGroup): void {
    const screeningTimes = [...formGroup.value.screeningTimes];
    screeningTimes.splice(index, 1);
    formGroup.patchValue({
      screeningTimes: screeningTimes,
    });
  }

  onCheckboxChanged(formGroup: FormGroup, index: number): void {
    const select = !formGroup.value.select;

    formGroup.patchValue({
      select: select,
    });

    if (select) {
      this.enableInput(formGroup);
    } else {
      this.disableInput(formGroup);
      this.resetInitialValue(formGroup, index);
    }
  }

  onSave(formGroup: FormGroup): void {
    const ticketData = formGroup.getRawValue();
    const modifiedTicket: updatedDbTicket = {
      movieId: ticketData.movieID,
      title: ticketData.title,
      price: ticketData.price,
      numOfTickets: ticketData.numOfTickets,
      screeningTimes: ticketData.screeningTimes,
    };
    this.ticketService
      .updateTicketById(modifiedTicket)
      .subscribe((_res: any) => {
        this.checkbox.toggle();
        this.disableInput(formGroup);
        formGroup.patchValue({
          select: false,
        });
      });
  }

  onDelete(index: number, formGroup: FormGroup): void {
    this.ticketService
      .deleteTicketById(formGroup.getRawValue().movieID)
      .subscribe({
        next: () => {
          const tableRows = this.manageTabForm.get('tableRows') as FormArray;
          tableRows.removeAt(index);
          this.table.renderRows();
        },
      });
  }

  get tableRowsArray() {
    return (this.manageTabForm.get('tableRows') as FormArray).controls;
  }

  private disableInput(formGroup: FormGroup): void {
    formGroup.get('price')?.disable();
    formGroup.get('numOfTickets')?.disable();
  }

  private enableInput(formGroup: FormGroup): void {
    formGroup.get('price')?.enable();
    formGroup.get('numOfTickets')?.enable();
  }

  private resetInitialValue(formGroup: FormGroup, index: number): void {
    formGroup.patchValue({ ...this.initialTicketData.at(index) });
  }
}
