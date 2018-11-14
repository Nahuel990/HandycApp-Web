
// export class Marcador {

//     constructor( public lat: number, public lng: number ) { }

// }


export class Marcador {

    public lat: number;
    public lng: number;

    public titulo = 'Título';
    public desc = '';
    public fecha = '';

    constructor( lat: number,  lng: number, fecha: string = '' ) {
        this.lat = lat;
        this.lng = lng;
        this.fecha = fecha;
    }

}

