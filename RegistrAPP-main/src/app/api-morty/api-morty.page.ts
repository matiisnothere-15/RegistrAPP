import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Firebase } from '../app.firebase';

import { Router } from '@angular/router';

@Component({
  selector: 'app-api-morty',
  templateUrl: './api-morty.page.html',
  styleUrls: ['./api-morty.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ApiMortyPage implements OnInit {
  
  personajes: any = [];

  usuarioActivo = new Firebase();

  constructor(private router: Router) { }

  async ngOnInit() {
    const cargando = document.getElementById('IdCargando');
    const contenido = document.getElementById('contenido');

    await this.obtenerInfoApi();

    /*
    if(cargando != null) {
      cargando.style.display = 'none';
    }
    if(contenido != null) {
      contenido.style.display = 'block';
    } */
  }

  async obtenerInfoApi() {
    const url = 'https://rickandmortyapi.com/api/character';
    try {
      const respuesta = await fetch(url);

      if(!respuesta.ok) {
        throw new Error('Ocurrió un error al obtener la información de la API')
      }

      const datos = await respuesta.json();

      this.personajes = datos.results;

      console.log(this.personajes);

    } catch (error) {
      console.log('ERRORRRR' + error);
    }
  }

  async redirigirLogin() {
    await this.usuarioActivo.sigoutUser();
    this.router.navigateByUrl('/login')
  }
}
