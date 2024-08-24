import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Animation, AnimationController, AlertController } from '@ionic/angular';

import { Router } from '@angular/router';
import { LoginPage } from '../login/login.page';
import { Firebase } from '../app.firebase';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.page.html',
  styleUrls: ['./restablecer-contrasena.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RestablecerContrasenaPage implements OnInit {
  private animacionUser: Animation = {} as Animation;
  usuario: string;
  login = new Firebase();

  public alertButtons = [
    {
      text: 'Aceptar',
      role: 'aceptar',
      handler: () => {
        this.redirigirLogin();
      },
    },
  ];

  constructor(private router: Router, private animationCtr: AnimationController, private alertController: AlertController) {
    this.usuario = ''
  }

  ngOnInit() {
    this.animacionUser = this.animationCtr.create()
    .addElement(document.querySelectorAll('.nombreUser'))
    .fill('none')
    .duration(250)
    .keyframes([
      { offset: 0, transform: 'scale(1.0)' },
      { offset: 0.5, transform: 'scale(1.1)'},
      { offset: 1, transform: 'scale(1.0)'},
    ]);
  }

  async presentAlert(header: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: `${header}`,
      message: `${mensaje}`,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async presentAlertEmail(header: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: `${header}`,
      message: `${mensaje}`,
      buttons: this.alertButtons,
    });

    await alert.present();
  }

  async recuperarUser() {
    const alertUser = document.getElementById('errorUserRecuperar');
    const login = new LoginPage(this.router, this.animationCtr, this.alertController);
    if(this.usuario == "") {
      this.animacionUser.play();
      if(alertUser !== null) {
        alertUser.innerText = '(requerido)'
      }
    } else {
      //validacion de usuarios existentes en Firebase o codigo de recuperación de cuenta
      const loading = document.getElementById('restablecerCargando');

      if(loading != null) {
        loading.style.display = 'block'
      }

      const correo = await this.login.recuperarContrasena(this.usuario) 

      if(loading != null) {
        loading.style.display = 'none'
      }

      if(correo) {
        this.presentAlertEmail('Correo electrónico de recuperación', `Te enviamos un correo a ${this.usuario} para recuperar tu cuenta, luego vuelve a iniciar sesión`);
      } else {
        this.presentAlert('Ocurrió un error', `Asegurate de ingresar un correo válido`)
      }

      /*
      let existeUsuario = false;
      login.usuarios.forEach(usuario => {
        if(usuario.nombre === this.usuario) {
          existeUsuario = true;
          alert(`Usuario "${this.usuario}" recuperado exitosamente`)
          this.redirigirLogin();
        }
      })
      if(!existeUsuario) {
        alert('El usuario que quieres recuperar no existe')
      }
      */
      
    }
  }

  redirigirLogin() {
    this.router.navigateByUrl('/login')
  }

}
