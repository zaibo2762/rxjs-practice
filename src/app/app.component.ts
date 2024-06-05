import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable, Subscription, debounceTime, filter, fromEvent, map, shareReplay, switchMap, tap } from 'rxjs';
import {AjaxResponse,ajax} from 'rxjs/ajax'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild("Search",{static:true}) 
  Search?:ElementRef<HTMLInputElement>
  users:any = []
  typeAheadsub?:Subscription

 ngOnInit(){
  const searchObs = fromEvent(this.Search!.nativeElement,"input")
                    .pipe(
                      debounceTime(2000),
                      filter((e:any)=>e.target.value != ""),
                      switchMap((e:any)=>{
                      return ajax(`https://api.github.com/search/users?q=${e.target.value}`)
                      }),
                      map((AjaxResponse:any)=>AjaxResponse.response.items)
                    )
 this.typeAheadsub = searchObs.subscribe((value:any)=>{
    //console.log(value)
    this.users = value
  })




  //Observable
   const pizzaObservable =new Observable((subscriber)=>{
    console.log("inside observeable")
    subscriber.next({name:"Farm House",veg:true,size:"small"})
    // subscriber.next({name:"Margerita",veg:true,size:"large"})
    // subscriber.next({name:"bar b q Chicken",veg:false,size:"extra large"})
    subscriber.complete()
   }).pipe(
    tap((pizza:any)=>{
      console.log('inside pipe')
      //side effects
      // if(pizza.size == "large"){
      //   throw new Error("Large size pizza are not Available")
      // }
    }),
    filter((pizza:any)=>pizza.veg==true),
    map((pizza:any)=> pizza.name),
    shareReplay()
   )

   //Subscriber
   pizzaObservable.subscribe(
    (value)=>console.log(value),
    (err)=>console.log(err.message),
    ()=>console.log('I am done eating pizza')
   )
   pizzaObservable.subscribe(
    (value)=>console.log(value),
    (err)=>console.log(err.message),
    ()=>console.log('I am done eating pizza')
   )
 }

 ngOnDestroy(){
  if(this.typeAheadsub){
    this.typeAheadsub.unsubscribe();
  }
 }
}


