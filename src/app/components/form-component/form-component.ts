import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Genre } from '../../models/genre.model';
import { Movie } from '../../models/movie.model';
// import { Card } from "primeng/card";
// import { MovieState } from '../../store/movie/movie.reducer';
// import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  selector: 'app-form-component',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    MultiSelectModule,
    MultiSelectModule,
    RatingModule,
    ButtonModule,
    DatePickerModule,
    ToggleSwitchModule
  ]
  ,
  templateUrl: './form-component.html',
  styleUrl: './form-component.scss',
})
export class FormComponent implements OnInit {
  //
  // Variable declarations
  //
  // Data inputs
  @Input() genres: Genre[] = [];
  @Input() movie: Movie = {} as Movie;
  // Event output
  @Output() cancel = new EventEmitter<void>();
  // Local variables
  movieForm: FormGroup;
  validator = {
    title: ['', Validators.required],
    overview: ['', [Validators.required, Validators.minLength(20)]],
    genre_ids: [[], Validators.required],
    poster_path: [''],
    release_date: [null, Validators.required],
    vote_average: [0],
  };

  //
  // Component lifecycle
  //
  // Dependency injection: The form builder
  constructor(private fb: FormBuilder) {
    this.movieForm = this.fb.group(this.validator);
  }
  // Bind the input data to the form
  ngOnInit(): void {
    this.movieForm.patchValue({ ...this.movie });
  }
}