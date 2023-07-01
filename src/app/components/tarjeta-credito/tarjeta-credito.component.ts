import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {

  listTarjeta:any [] = [];
  accion = "Agregar";


  form: FormGroup;
  id: number | undefined;
  constructor (private fb:FormBuilder,
    private _tarjetaService: TarjetaService
    )  {
    this.form = this.fb.group({
      titular:['',Validators.required],
      numeroTarjeta:['',[Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      FechaExpiracion:['',[Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      ccv:['',[Validators.required, Validators.maxLength(3), Validators.minLength(3)]]

    })
  }
   
  ngOnInit(): void{
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this._tarjetaService.getListTarjetas().subscribe(data =>{
      console.log(data);
      this.listTarjeta = data
    },error =>{
      console.log();
    })
  }

  agregarTarjeta(){
    console.log(this.form);

    const tarjeta: any = {
      titular:this.form.get('titular')?.value,
      numeroTarjeta:this.form.get('numeroTarjeta')?.value,
      FechaExpiracion:this.form.get('FechaExpiracion')?.value,
      ccv:this.form.get('ccv')?.value
    }

    if(this.id == undefined){
      this._tarjetaService.saveTarjeta(tarjeta).subscribe(data =>{
        this.obtenerTarjetas();
        this.form.reset();
      },error =>{
        console.log(error);
      }
      )
    }else{
      tarjeta.id = this.id;
      this._tarjetaService.updateTarjeta(this.id, tarjeta).subscribe(data =>{
        this.form.reset();
        this.accion = 'Agregar';
        this.id = undefined;
        this.obtenerTarjetas();
      },error => {
        console.log(error);
      })
    } 




    this._tarjetaService.saveTarjeta(tarjeta).subscribe(data =>{
      this.obtenerTarjetas();
      this.form.reset();
    },error =>{
      console.log(error);
    }
    )
  }
  eliminarTarjeta(id: number){
    this._tarjetaService.deleteTarjeta(id).subscribe(data =>{
      this.obtenerTarjetas();
    },error =>{
      console.log(error);
    })
  }
  editarTarjeta(tarjeta: any){
      this.accion = 'Editar';
      this.id = tarjeta.id;

      this.form.patchValue({
        titular: tarjeta.titular,
        numeroTarjeta:tarjeta.numeroTarjeta,
        FechaExpiracion:tarjeta.FechaExpiracion,
        ccv: tarjeta.ccv
      })
    }
  


}
