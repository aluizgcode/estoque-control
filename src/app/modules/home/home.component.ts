import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.email],
    password: ['', Validators.required],
  });

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.email],
    password: ['', Validators.required],
  })

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService
  ) {}

  onSubmitLoginForm(): void {
    console.log(">> Dados do login", this.loginForm.value);
    if (this.loginForm.value && this.loginForm.valid) {
      console
      this.userService.authUser(this.loginForm.value as AuthRequest)
      .subscribe({
        next: (response) => {
          if (response) {
            this.cookieService.set('USER_INFO', response?.token);
            this.loginForm.reset
          }
        },
        error(err) {
            console.log(err);
            alert("As informações de login estão incorretas.");
        },
      });
    } else {
      console.log(">> Erro ao acessar o serviço de autenticacao");
    }
  }

  onSubmitSignupForm(): void {
    console.log(">> Dados de criacao do usuario", this.signupForm.value);

    if (this.signupForm.value && this.signupForm.valid) {
      this.userService.signupUser(this.signupForm.value as SignupUserRequest)
      .subscribe({
        next: (response) => {
          if (response) {
            console.log(">> Usuário criado com sucesso");
            alert("Usuario criado com sucesso");
            this.signupForm.reset;
            this.loginForm.reset;
            this.loginCard = true;
          }
        },
        error: (err) => {
          console.log(err);
          alert("Erro ao criar o usuário");
        }
      })
    } else {
      console.log(">> Formulario invalido");
    }
  }
}
