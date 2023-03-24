import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Appointment } from '../appointment';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent {
  @Input() appointment!: Appointment;
  @Output() deleteAppointment = new EventEmitter<Appointment>();
  isDragging = false;

  delete(): void {
    this.deleteAppointment.emit(this.appointment);
  }

  dragStart(): void {
    this.isDragging = true;
  }

  dragEnd(): void {
    this.isDragging = false;
  }
}
