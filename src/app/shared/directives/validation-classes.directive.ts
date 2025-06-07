import { Directive, inject, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[validationClasses]',
  standalone: true,
  host: {
    '(ionBlur)': 'markAsTouched()',
    '[class.ion-valid]': 'isValid()',
    '[class.ion-invalid]': 'isInvalid()',
    '[class.ion-touched]': 'touched'
  }
})
export class ValidationClassesDirective implements OnInit {
  private ngControl = inject(NgControl, { optional: true });
  touched = false;

  markAsTouched() {
    this.touched = true;
  }

  isValid(): boolean {
    return (this.touched && this.ngControl?.valid) ?? false;
  }

  isInvalid(): boolean {
    return (this.touched && this.ngControl?.invalid) ?? false;
  }

  ngOnInit() {}
}
