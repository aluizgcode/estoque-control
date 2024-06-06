import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.email],
    passwd: ['', Validators.required],
  });

  createForm = this.formBuilder.group({
    nome: ['', Validators.required],
    email: ['', Validators.email],
    passwd: ['', Validators.required],
  })


  constructor(private formBuilder: FormBuilder) {}

  onSubmitLoginForm(): void {
    console.log(">> Dados do login", this.loginForm.value);
  }

  onSubmitCreateForm(): void {
    console.log(">> Dados de criacao do usuario", this.createForm.value);
  }
}
