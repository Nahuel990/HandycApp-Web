import { Component, OnInit } from '@angular/core';
import { Marcador } from '../../classes/marcador.class';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MapaEditarComponent } from './mapa-editar.component';

import { Router } from '@angular/router'

import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  marcadores: Marcador[] = [];
  marcadoresDB: AngularFireList<any>;
  marcadoresObs: Observable<any[]>;

  lat = -31.420390;
  lng = -64.188855;

  constructor( public snackBar: MatSnackBar,
               public dialog: MatDialog,
               private firebase: AngularFireDatabase,
               private router: Router,) {

    if (localStorage.getItem('marcadores')) {
      this.marcadores = JSON.parse(localStorage.getItem('marcadores'));
    }
  }

  //Limpiar objeto y Local Storage
  clearLocalData(){
    this.marcadores = []; 
    localStorage.clear();
  }

  ngOnInit() { 
    // this.clearLocalData();
    // this.checkLogin();
    this.getDataDBToJsonAndSetInClass();
  }

  //Check login
  checkLogin(){
    if (!localStorage.getItem('userId')) {
      this.router.navigate(['login']);
    }
  }

  //Obtener data de firebase
  getDataDB(){
    this.marcadoresDB = this.firebase.list('marcadores-web');
    return this.marcadoresDB;
  }

  //Obtener data en Json basandose en marcadoresDB y setearla en la lista de marcadores
  getDataDBToJsonAndSetInClass(){
    this.getDataDB();
    this.marcadoresObs = this.marcadoresDB.valueChanges();
    this.marcadoresObs.subscribe(items => {
      for (let i = 0; i < items.length; i++) {
        var lat = items[i].lat;
        var lng = items[i].lng;
        var marcador = new Marcador(parseFloat(lat.toString()), parseFloat(lng.toString()));
        this.marcadores.push(marcador);
      }
    });
  }

  //insertar en la base una vez que se haya agregado a localStorage
  insertDataDB(marcador: Marcador){
    //Verificar que traiga la data de la db
    // if(!this.marcadoresDB){
    //   this.marcadoresDB = this.getDataDB();
    // }

    let now = new Date();
    var fArr = now.toString().split(" ");
    var fecha = fArr[0] + " " + fArr[1] + " " + fArr[2] + " " + fArr[4] + " " + "GMT-03:00" + " " + fArr[3];
    
    this.marcadoresDB = this.firebase.list(fecha.trim());
    this.marcadoresDB.push({
      lat: marcador.lat,
      lng: marcador.lng
    }) 
  }

  //Actualizar dato en la base
  updateDataDB(marcador: Marcador){
    //Verificar que traiga la data de la db
    if(!this.marcadoresDB){
      this.marcadoresDB = this.getDataDB();
    }

    this.marcadoresDB.update("id marcador",{
      lat: marcador.lat,
      lng: marcador.lng
    })
  }

  //Eliminar dato en al base
  deleteDataDB($key: string){
    //Verificar que traiga la data de la db
    if(!this.marcadoresDB){
      this.marcadoresDB = this.getDataDB();
    }

    this.marcadoresDB.remove($key);
  }

  agregarMarcador( evento ) {
    const coords: { lat: number, lng: number } = evento.coords;
    const nuevoMarcador = new Marcador( coords.lat, coords.lng );
    this.marcadores.push( nuevoMarcador );
    this.guardarStorage();
    this.insertDataDB(new Marcador( coords.lat, coords.lng ));
    this.snackBar.open('Marcador agregado', 'Cerrar', { duration: 3000 });
  }

  borrarMarcador( i: number ) {
    this.marcadores.splice(i, 1);
    this.guardarStorage();
    this.deleteDataDB(i.toString());
    this.snackBar.open('Marcador borrado', 'Cerrar', { duration: 3000 });
  }

  editarMarcador( marcador: Marcador ) {
    const dialogRef = this.dialog.open( MapaEditarComponent , {
      width: '250px',
      data: { titulo: marcador.titulo, desc: marcador.desc, fecha: marcador.fecha }
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !result ) {
        return;
      }

      marcador.titulo = result.titulo;
      marcador.desc = result.desc;
      marcador.fecha = result.fecha;

      this.guardarStorage();
      this.snackBar.open('Marcador actualizado', 'Cerrar', { duration: 3000 });
    });
  }

  guardarStorage() {
    localStorage.setItem('marcadores', JSON.stringify( this.marcadores ) );
  }
}
