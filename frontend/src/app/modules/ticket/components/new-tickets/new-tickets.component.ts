import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { TicketService } from '../../services/ticket.service';
import { NewTickets } from 'src/app/shared/models/newTicketInterface';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
  FormControl,
} from '@angular/forms';
import { SnackbarService } from 'src/app/core/services/snack-bar/snackbar.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-new-tickets',
  templateUrl: './new-tickets.component.html',
  styleUrls: ['./new-tickets.component.scss'],
})
export class NewTicketsComponent {
  ELEMENT_DATA: NewTickets[] = [];
  displayedColumns: string[] = ['select', 'movieID', 'title'];
  dataSource = new MatTableDataSource<NewTickets>(this.ELEMENT_DATA);
  checkedBoxes: NewTickets[] = [];
  movieFormList: FormGroup[] = [];
  selectedDates: Date[] = [];

  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  constructor(
    private ticketService: TicketService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.ticketService.getMovieList().subscribe((response) => {
      for (const element of response.results) {
        const newElement: NewTickets = {
          select: false,
          movieID: element.id,
          title: element.title,
        };
        this.ELEMENT_DATA.push(newElement);
      }
      this.dataSource.paginator = this.paginator;
    });
  }

  onCheckboxChange(event: MatCheckboxChange, element: NewTickets) {
    element.select = event.checked;
    if (event.checked) {
      this.checkedBoxes.push(element);
      this.movieFormList.push(this.formGroupCreator(element));
    } else {
      const index = this.checkedBoxes.findIndex((movie: NewTickets) => {
        return movie.movieID === element.movieID;
      });
      this.checkedBoxes.splice(index, 1);
      this.movieFormList.splice(index, 1);
    }
  }

  formGroupCreator(movie: NewTickets): FormGroup {
    const formGroup: FormGroup = this.formBuilder.group({
      movieId: [{ value: movie.movieID, disabled: true }],
      title: [{ value: movie.title, disabled: true }],
      price: ['', [Validators.required, Validators.min(0)]],
      numOfTickets: ['', [Validators.required, Validators.min(0)]],
      screeningTimes: this.formBuilder.array([], Validators.required),
    });
    return formGroup;
  }

  addSelectedDate(
    event: MatDatepickerInputEvent<Date>,
    formGroup: FormGroup
  ): void {
    const selectedDate = event.value;
    const screeningTimesControl = formGroup.get('screeningTimes') as FormArray;
    if (selectedDate && !screeningTimesControl.value.includes(selectedDate)) {
      screeningTimesControl.push(new FormControl(selectedDate));
    }
  }

  removeSelectedDate(index: number, formGroup: FormGroup): void {
    const screeningTimesControl = formGroup.get('screeningTimes') as FormArray;
    screeningTimesControl.removeAt(index);
  }

  areAllFormsValid(): boolean {
    return this.movieFormList.every((formGroup: FormGroup) => {
      return formGroup.valid;
    });
  }

  submitForms(): void {
    this.ticketService.submitNewTickets(this.movieFormList).subscribe({
      next: (existingTicketList: any) => {
        this.checkedBoxes = [];
        this.ELEMENT_DATA.forEach((movie: NewTickets) => {
          movie.select = false;
          if (
            existingTicketList.moviesAlreadyInDB.movieId.includes(movie.movieID)
          ) {
            movie.isInDB = true;
            this.snackbarService.showInfoMessage(
              'New tickets submitted.  Movies already in DB highlighted in red'
            );
          } else {
            this.snackbarService.showInfoMessage('All tickets submitted');
          }
          this.movieFormList = [];
        });
      },
    });
  }
}
