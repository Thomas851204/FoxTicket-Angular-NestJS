import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-token-dialog',
  templateUrl: './token-dialog.component.html',
  styleUrls: ['./token-dialog.component.scss'],
})
export class TokenDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TokenDialogComponent>,
    private router: Router
  ) {}

  navigateToLogin(): void {
    this.dialogRef.close();
    this.router.navigate(['user/login']);
  }
}
