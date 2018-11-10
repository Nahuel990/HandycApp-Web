import { Component, OnInit } from '@angular/core';
import { Marcador } from '../../classes/marcador.class';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MapaEditarComponent } from './mapa-editar.component';

import { AngularFireDatabase, AngularFireList  } from 'angularfire2/database';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  marcadores: Marcador[] = [];
  marcadoresDB: AngularFireList<any>;

  lat = -31.420390;
  lng = -64.188855;

  constructor( public snackBar: MatSnackBar,
               public dialog: MatDialog,
               private firebase: AngularFireDatabase) {

    if (localStorage.getItem('marcadores')) {
      this.marcadores = JSON.parse(localStorage.getItem('marcadores'));
    }

  }

  //Llamar metodo getDataDB y setear los datos en la clase para que se muestren
  ngOnInit() {
    this.getDataDB();
    console.log(this.getDataDB());
      // .snapshotChanges()
      // .subscribe(item => {
      //   this.marcadores = [];
      //   item.forEach(element => {
      //     let x = element.payload.toJSON();
      //     x["$key"] = element.key;
      //     this.marcadores.push(x as Marcador);
      //   })
      // })
  }

  //Obtener data de firebase y guardarlos en localstorage
  getDataDB(){
    return this.marcadoresDB = this.firebase.list('tesis-8376b');
  }

  //insertar en la base una vez que se haya agregado a localStorage
  insertDataDB(marcador: Marcador){
    this.marcadoresDB.push({
      lat: marcador.lat,
      lng: marcador.lng
    }) 
  }

  //Actualizar dato en la base
  updateDataDB(marcador: Marcador){
    this.marcadoresDB.update("id marcador",{
      lat: marcador.lat,
      lng: marcador.lng
    })
  }

  //Eliminar dato en al base
  deleteDataDB($key: string){
    this.marcadoresDB.remove($key);
  }

  agregarMarcador( evento ) {

    const coords: { lat: number, lng: number } = evento.coords;

    const nuevoMarcador = new Marcador( coords.lat, coords.lng );

    this.marcadores.push( nuevoMarcador );

    this.guardarStorage();
    this.insertDataDB(nuevoMarcador);
    this.snackBar.open('Marcador agregado', 'Cerrar', { duration: 3000 });

  }

  borrarMarcador( i: number ) {

    this.marcadores.splice(i, 1);
    this.guardarStorage();
    this.snackBar.open('Marcador borrado', 'Cerrar', { duration: 3000 });
  }

  editarMarcador( marcador: Marcador ) {

    const dialogRef = this.dialog.open( MapaEditarComponent , {
      width: '250px',
      data: { titulo: marcador.titulo, desc: marcador.desc, fecha: marcador.fecha }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

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
