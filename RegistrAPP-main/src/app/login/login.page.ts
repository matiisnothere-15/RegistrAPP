import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Animation, AnimationController, AlertController, isPlatform } from '@ionic/angular';

import { Router } from '@angular/router';
import { User } from '../app.user';
import { Firebase } from '../app.firebase';

import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  private animacionNombre: Animation = {} as Animation;
  private animacionPassword: Animation = {} as Animation;
  nombre: string;
  password: string;
  private login = new Firebase();

  //Usuarios registrados
  public usuarios: User[] = [
    {
      id: 1,
      nombre: "cristobal",
      password: "1234"
    },
    {
      id: 2,
      nombre: "matias",
      password: "1111"
    },
    {
      id: 3,
      nombre: "maria",
      password: "2222"
    },
    {
      id: 4,
      nombre: "pablo",
      password: "0000"
    },
  ]

  constructor(private router: Router, private animationCtr: AnimationController, private alertController: AlertController) { 
    this.nombre = '',
    this.password = ''
  }

  ionViewWillEnter() {
    const loading = document.getElementById('cargando');
    const alertNombre = document.getElementById('errorUser');
    const alertPass = document.getElementById('errorPass');
    if(loading != null) {
      loading.style.display = 'none'
    }
    this.nombre = '';
    this.password = '';
    if (alertNombre !== null) {
      alertNombre.textContent = '';
    }
    if (alertPass !== null) {
      alertPass.textContent = '';
    }
  }

  async ngOnInit() {
    //Aplicando color a la barra de estado a dispositivos Android
    if(isPlatform("capacitor")) {
      await StatusBar.setBackgroundColor({ color: '#012c56' });
    }

    //inicializando Firebase
    this.login.firebaseInit();

    this.animacionNombre = this.animationCtr.create()
    .addElement(document.querySelectorAll('.usuario'))
    .fill('none')
    .duration(250)
    .keyframes([
      { offset: 0, transform: 'scale(1.0)' },
      { offset: 0.5, transform: 'scale(1.1)'},
      { offset: 1, transform: 'scale(1.0)'},
    ]);

    this.animacionPassword = this.animationCtr.create()
    .addElement(document.querySelectorAll('.password'))
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

  async validarDatos() {
    const alertNombre = document.getElementById('errorUser');
    const alertPass = document.getElementById('errorPass');
    const loading = document.getElementById('cargando');

    if(this.nombre == "" && this.password == "") {
      //verifica que el campo del mesaje no sea nulo
      if (alertNombre !== null) {
        alertNombre.textContent = '(requerido)';
      }
      if (alertPass !== null) {
        alertPass.textContent = '(requerido)';
      }
      this.animacionNombre.play();
      this.animacionPassword.play();
    }
    if(this.nombre == "") {
      if (alertNombre !== null) {
        alertNombre.textContent = '(requerido)';
      }
      this.animacionNombre.play();
    } else if(this.password == "") {
      if (alertPass !== null) {
        alertPass.textContent = '(requerido)';
      }
      this.animacionPassword.play();
    } else {
      //validación de usuarios en BD
      if(loading != null) {
        loading.style.display = 'block'
      }
      const usuarioLogeado = await this.login.signinUser(this.nombre, this.password);

      if(usuarioLogeado) {
        this.redirigirHome()
      } else {
        this.presentAlert('Inicio de sesión fallido', 'Usuario y/o contraseña incorrectos')
        if(loading != null) {
          loading.style.display = 'none'
          this.nombre = '';
          this.password = '';
          if (alertNombre !== null) {
            alertNombre.textContent = '';
          }
          if (alertPass !== null) {
            alertPass.textContent = '';
          }
        }
      }

      /* Inicio de sesión por lista de objetos User
      let usuarioEncontrado = false;
      this.usuarios.forEach(usuario => {
        if(usuario.nombre === this.nombre && usuario.password == this.password) {
          usuarioEncontrado = true;
          this.redirigirHome();
        } 
      });

      if(!usuarioEncontrado) {
        alert("Usuario y/o contraseña incorrectos")
      }
      */
    }
  }

  redirigirHome() {
    this.router.navigateByUrl('/home/tabs/scanner')
  }

  redirigirRecuperar() {
    this.router.navigateByUrl('/restablecer-contrasena')
  }

}
