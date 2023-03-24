import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddAppointmentDialogComponent } from '../add-appointment-dialog/add-appointment-dialog.component';
import { Appointment } from '../appointment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  appointments: Appointment[] = [
    { title: 'Meeting with customers', date: new Date('2023-03-24T09:00:00Z') },
    { title: 'Business lunch', date: new Date('2023-03-25T12:00:00Z') },
    { title: 'Conference call', date: new Date('2023-03-27T14:00:00Z') },
  ];

  weeks: Date[][] = [];

  year: number;
  month: number;

  monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  constructor(private dialog: MatDialog) {
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth();
    this.updateCalendar();
  }

  updateCalendar(): void {
    const firstDayOfMonth = new Date(this.year, this.month, 1);
    const lastDayOfMonth = new Date(this.year, this.month + 1, 0);
    const numberOfDays = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    let currentDay = 1 - firstDayOfWeek;
    this.weeks = [];
    while (currentDay <= numberOfDays) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(this.year, this.month, currentDay);
        week.push(date);
        currentDay++;
      }
      this.weeks.push(week);
    }
  }

  addAppointment(appointment: Appointment): void {
    this.appointments.push(appointment);
  }

  deleteAppointment(appointment: Appointment): void {
    const index = this.appointments.indexOf(appointment);
    if (index !== -1) {
      this.appointments.splice(index, 1);
    }
  }

  updateAppointment(event: { appointment: Appointment, newDate: Date }): void {
    const { appointment, newDate } = event;
    const index = this.appointments.indexOf(appointment);
    if (index !== -1) {
      const newAppointment: Appointment = {
        title: appointment.title,
        date: newDate
      };
      this.appointments[index] = newAppointment;
    }
  }

  getAppointmentsForDay(day: Date): Appointment[] {
    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getFullYear() === day.getFullYear() &&
        appointmentDate.getMonth() === day.getMonth() &&
        appointmentDate.getDate() === day.getDate();
    });
  }

  openAddAppointmentDialog(day: Date): void {
    const dialogRef = this.dialog.open(AddAppointmentDialogComponent, {
      width: '400px',
      data: {
        date: day
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newDate = result.date;
        this.updateAppointment(result);
      }
    });
  }

  drop(event: CdkDragDrop<Appointment[], Appointment[], any>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex,
        event.currentIndex);
    } else {
      const appointment = event.previousContainer.data[event.previousIndex];
      const day = event.container.data[0].date;
      appointment.date = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      this.addAppointment(appointment);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }

  }

  previousMonth(): void {
    this.month--;
    if (this.month < 0) {
      this.month = 11;
      this.year--;
    }
    this.updateCalendar();
  }

  nextMonth(): void {
    this.month++;
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
    this.updateCalendar();
  }
}

