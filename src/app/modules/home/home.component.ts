import { MessageService } from 'primeng/api';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';

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
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router,
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
            this.loginForm.reset;
            this.router.navigate(['/dashboard']);
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Bem vindo de volta ${response?.name}`,
              life: 3000,
            });
          }
        },
        error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Falha',
              detail: 'Erro ao realizar login',
              life: 3000,
            });
        },
      });
    } else {
      console.log(">> Erro ao acessar o serviço de autenticacao");
      this.messageService.add({
        severity: 'error',
        summary: 'Falha',
        detail: 'Erro ao acessar o serviço de autenticacao',
        life: 3000,
      })
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
            this.signupForm.reset;
            this.loginForm.reset;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário criado com sucesso',
              life: 3000,
            });
            this.loginCard = true;
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Falha',
            detail: 'Erro ao criar usuário',
            life: 3000,
          })
        }
      })
    } else {
      console.log(">> Formulario invalido");
      this.messageService.add({
        severity: 'error',
        summary: 'Falha',
        detail: 'Dados inválidos',
        life: 3000,
      })
    }
  }
}
