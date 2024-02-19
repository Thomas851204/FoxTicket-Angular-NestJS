import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      verticalPosition: 'top',
      panelClass: 'error-snackbar',
      duration: 5000,
    });
  }

  showInfoMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      verticalPosition: 'top',
      panelClass: 'info-snackbar',
      duration: 5000,
    });
  }
}
