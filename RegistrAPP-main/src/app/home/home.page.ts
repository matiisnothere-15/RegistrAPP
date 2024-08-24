import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { IonicModule, AlertController, isPlatform } from '@ionic/angular';

import { Router, ActivatedRoute } from '@angular/router';

//Scanner QR
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

//Firebase y Firestore
import { Firebase } from '../app.firebase';
import { doc, getDoc, getFirestore } from "firebase/firestore";

//Animacion para botón
import { Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})

export class HomePage implements AfterViewInit, OnDestroy {
  usuarioLogeado: string | null;
  private animacionBtnScan: Animation = {} as Animation;

  usuarioActivo = new Firebase();
  idUsuario = '';
  nombreUsuario = '';

  constructor(private router: Router, private route: ActivatedRoute, private alertController: AlertController, private animationCtrl: AnimationController) {
    this.usuarioLogeado = null;
    this.idUsuario = this.usuarioActivo.obtenerInfoUserActivo();
  }

  ngOnDestroy() {
    const cuerpo = document.querySelector('body');
    BarcodeScanner.stopScan();
    if(cuerpo != null) {
      cuerpo.classList.remove('scanner-active')
    }
  }

  async ngAfterViewInit() {
    this.animacionBtnScan = this.animationCtrl.create()
    .addElement(document.querySelectorAll('.btn_ingresar_scan'))
    .fill('none')
    .duration(1000)
    .iterations(Infinity)
    .keyframes([
      { offset: 0, transform: 'scale(1)' },
      { offset: 0.5, transform: 'scale(1.1)' },
    ]);

    this.animacionBtnScan.play();

    const btnStop = document.getElementById('btn_stop');
    const cargando = document.getElementById('IdCargando');
    const contenido = document.getElementById('IdContenido');

    if(btnStop) {
      btnStop.style.display = 'none'
    }

    this.nombreUsuario = await this.obtenerNombreUser();
    
    if(cargando != null) {
      cargando.style.display = 'none';
    }

    if(contenido != null) {
      contenido.style.display = 'block'
    }

    this.route.paramMap.subscribe(parametro => {
      this.usuarioLogeado = parametro.get('user');
    });
  }

  async scanearQR() {
    const cuerpo = document.querySelector('body');
    const contenido = document.getElementById('IdContenido');
    const btnStop = document.getElementById('btn_stop');
    const tab = document.querySelector('ion-tab-bar');
    const cargandoRegistro = document.getElementById('cover-spin');

    if(isPlatform("capacitor")) {
      const permitido = await this.verificarPermisos();
      if(permitido) {
        if(cuerpo != null) {
          cuerpo.classList.add('scanner-active')
        }
        if(btnStop) {
          btnStop.style.display = 'flex'
        }
        if(tab != null) {
          tab.style.display = 'none'
        }
        if(contenido != null) {
          contenido.style.display = 'none'
        }
        const result = await BarcodeScanner.startScan();

        if(cargandoRegistro != null) {
          cargandoRegistro.style.display = 'block'
        }

        // Si el codigo QR tiene contenido
        if (result.hasContent) { 
          //======Proceso de registro va AQUÍ=======
          const registro = new Firebase();
          const completado = await registro.registrarAsistencia(this.idUsuario, result.content);
          if(cargandoRegistro != null) {
            cargandoRegistro.style.display = 'none'
          }
          if(completado) {
            const alert = await this.alertController.create({
              header: `Proceso completado`,
              message: `Su asistencia fue registrada con éxito`,
              buttons: ['Aceptar'],
            });
            await alert.present();
          } else {
            const alert = await this.alertController.create({
              header: `Proceso fallido`,
              message: `Ocurrío un error al registrar su asistencia, intentelo más tarde`,
              buttons: ['Aceptar'],
            });
            await alert.present();
          }
        }

        //Quitando estilos una vez registrada la asistencia
        if(cuerpo != null) {
          cuerpo.classList.remove('scanner-active')
        }
        if(tab != null) {
          tab.style.display = 'flex'
        }
        if(btnStop) {
          btnStop.style.display = 'none'
        }
        if(contenido != null) {
          contenido.style.display = 'block'
        }
      }
    } else {
      alert('Ejecuta la aplicación desde un dispositivo móvil para habilitar esta función')
    }
    
  }

  async verificarPermisos() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true })
      if(status.granted) {
        resolve(true)
      } else if(status.denied) {
        const alerta = await this.alertController.create({
          header: 'No tengo permisos',
          message: 'Por favor permite el uso de camara en la configuración de tu dispositivo',
          buttons: [{
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Abrir configuraciones',
            handler: () => {
              BarcodeScanner.openAppSettings();
              resolve(false);
            }
          }
        ]
        });
        await alerta.present();
      }
    })
  }

  stopScan() {
    const cuerpo = document.querySelector('body');
    const contenido = document.getElementById('IdContenido');
    const btnStop = document.getElementById('btn_stop');
    const tab = document.querySelector('ion-tab-bar');

    BarcodeScanner.stopScan();
    if(btnStop) {
      btnStop.style.display = 'none'
    }
    if(contenido != null) {
      contenido.style.display = 'block'
    }
    if(tab != null) {
      tab.style.display = 'flex'
    }
    if(cuerpo != null) {
      cuerpo.classList.remove('scanner-active')
    }
  }

  //Obteniendo información de usuario autenticado
  async obtenerNombreUser() {
    const docRef = doc(getFirestore(), "usuario", this.idUsuario);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
      return docSnap.get('nombres')
    } else {
      return 'No se obtuvo el nombre de usuario'
    }
  }

  async redirigirLogin() {
    await this.usuarioActivo.sigoutUser();
    this.router.navigateByUrl('/login')
  }
  
}
