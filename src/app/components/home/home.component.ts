import { DatePipe, formatDate } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { ToastrService } from 'ngx-toastr';
import { DtoPolygonUser } from 'src/app/models/dtoPolygonUser';
import { DtoUserLine } from 'src/app/models/dtoUserLine';
import { GuzergahService } from 'src/app/services/guzergah.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  mapa: mapboxgl.Map;
  users: DtoUserLine[] = [];
  mapMarkers: any = [];
  mapMarker: mapboxgl.Marker;
  selectedDate1: Date;
  selectedDate2: Date;
  message: string = '';
  onlyTime: boolean = false;
  onlyDate: boolean = false;
  onlyADateTime: boolean = true;
  selectedItem: string[] = ['', ''];
  process: number = 1;
  pointLength: number = 10;
  constructor(
    private guzergahService: GuzergahService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {
    
  }

  ngOnInit(): void {(mapboxgl as typeof mapboxgl).accessToken = environment.mapboxKey;
    this.getMap([28.891412, 41.0256673], 14);
  }
  getPointValue(): void {
    console.log(this.pointLength);
  }
  getSelectedDate() {
    this.message = '';
    if (this.selectedDate1 !== undefined) {
      if (this.onlyDate && this.onlyTime) {
        this.message = 'Selected Only Time or Only Date';
      } else {
        var pipe = new DatePipe('en-US');
        if (this.onlyADateTime === true) {
          if (this.onlyDate) {
            this.selectedItem[0] = pipe.transform(
              this.selectedDate1,
              'YYYY-MM-dd'
            )!;
            this.selectedItem[1] = '';
          }
          if (this.onlyTime) {
            this.selectedItem[0] = pipe.transform(this.selectedDate1, 'HH:mm')!;
            this.selectedItem[1] = '';
          }
          if (!this.onlyDate && !this.onlyTime) {
            this.selectedItem[0] = pipe.transform(
              this.selectedDate1,
              'dd/MM/YYYY HH:mm:ss'
            )!;
            this.selectedItem[1] = '';
          }
        } else {
          if (this.onlyDate) {
            this.selectedItem[0] = pipe.transform(
              this.selectedDate1,
              'YYYY-MM-dd'
            )!;
            this.selectedItem[1] = pipe.transform(
              this.selectedDate2,
              'YYYY-MM-dd'
            )!;
          }
          if (this.onlyTime) {
            this.selectedItem[0] = pipe.transform(this.selectedDate1, 'HH:mm')!;
            this.selectedItem[1] = pipe.transform(this.selectedDate2, 'HH:mm')!;
          }
          if (!this.onlyDate && !this.onlyTime) {
            this.selectedItem[0] = pipe.transform(
              this.selectedDate1,
              'YYYY-MM-dd HH:mm'
            )!;
            this.selectedItem[1] = pipe.transform(
              this.selectedDate2,
              'YYYY-MM-dd HH:mm'
            )!;
          }
        }
        this.message = 'Haritada Poligon çizebilirsiniz.';
      }
    } else {
      this.message = 'Lütfen tarih seçin.';
    }
    this.deleteScrean();
    this.getMap([28.891412, 41.0256673], 14);
  }
  clearForm() {
    this.selectedItem = [];
  }
  getShowPopup(userRoute: DtoUserLine) {
    if (this.mapMarker !== undefined) {
      this.mapMarker.togglePopup();
    }
    console.log(this.users.indexOf(userRoute));
    
    var a = this.mapMarkers[this.users.indexOf(userRoute)] as mapboxgl.Marker;
    
    this.mapa.flyTo({
      center: [a.getLngLat().lng, a.getLngLat().lat],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
    a.togglePopup();
    this.mapMarker = a;
  }
  getSelectProcess(process: number) {
    this.process = process;
  }
  creatLine(routeDetay: DtoUserLine) {
    console.log(routeDetay.id);
    var random=routeDetay.id+Math.floor(Math.random() * 10000);
    this.mapa.on('load', () => {
      this.mapa.addSource('route'+random, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeDetay.yol.coordinates,
          },
        },
      });
      
      this.mapa.addLayer({
        id: 'route'+random,
        type: 'line',
        source: 'route'+random,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color':
            '#' + (Math.random().toString(16) + '000000').substring(2, 8),
          'line-width': 8,
        },
      });
    });
  }
  getMap(coordinate: [number, number], zoom: number) {
    this.mapa = new mapboxgl.Map({
      container: 'mapa-mapbox',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinate,
      zoom: zoom,
    });
    var ob = Object.assign(
      {},
      {
        Dates: this.selectedItem,
        OnlyTime: this.onlyTime,
        OnlyDate: this.onlyDate,
        OnlyADate: this.onlyADateTime,
      }
    );
    this.guzergahService.getUsersLine(ob).subscribe((data) => {
      if (data.success) {
        this.users = data.data;
        console.log(data
          .data[0].firstPoint.coordinates[0]);
        
        this.users.forEach((user) => {
          this.creatLine(user);
          this.createPopup(this.mapa, user);
          this.createPopup(this.mapa,user)
        });
      }
    });
  }
  deleteScrean() {
    this.mapMarkers.forEach((m: any) => m.remove());
    this.mapMarkers = [];
    this.mapMarker = this.mapMarkers[0];
  }
  createPopup(map: mapboxgl.Map, route: DtoUserLine) {
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      '<h5>Name :' +
        route.name +
        ' ' +
        route.surname +
        '</h5> <b>Email : </b>' +
        route.email+
        '<br/><b>Route Date :</b> ' +
        formatDate(route.routeStartDate, 'dd/MM/yyyy', 'en-US') +
        '<br/> <b> Route Time :</b> ' +
        formatDate(route.routeStartDate, 'HH:mm:ss', 'en-US') 
    );
    /*  */
    // create DOM element for the marker
    const el = document.createElement('div');
    el.id = 'marker';
    // create the marker
    let marker = new mapboxgl.Marker({
      draggable: false,
      color: '#' + (Math.random().toString(16) + '000000').substring(2, 8),
    })
      .setLngLat([
        route.firstPoint.coordinates[0],
        route.firstPoint.coordinates[1],
      ])
      .setPopup(popup) // sets a popup on this marker
      .addTo(map);
    this.mapMarkers.push(marker);
  }
}
