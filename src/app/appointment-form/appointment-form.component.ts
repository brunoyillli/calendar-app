import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Appointment } from '../appointment';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
  appointmentForm: FormGroup;

  @Output() appointmentAdded = new EventEmitter<Appointment>();

  constructor(private formBuilder: FormBuilder) {
    this.appointmentForm = this.formBuilder.group({
      title: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const appointment = {
        title: this.appointmentForm.get('title')?.value,
        date: new Date(this.appointmentForm.get('date')?.value)
      };
      this.appointmentAdded.emit(appointment);
      this.appointmentForm.reset();
    }
  }
}
