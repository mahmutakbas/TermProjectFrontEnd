import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { GuzergahService } from 'src/app/services/guzergah.service';
import { environment } from 'src/environments/environment';
import { DtoPolygonUser } from 'src/app/models/dtoPolygonUser';
import { DatePipe, formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-drawsearch',
  templateUrl: './drawsearch.component.html',
  styleUrls: ['./drawsearch.component.css'],
})

export class DrawsearchComponent implements OnInit {
  mapa: mapboxgl.Map;
  users: DtoPolygonUser[] = [];
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
  pointLength:number=10;
  constructor(
    private guzergahService: GuzergahService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {
   
  }

  ngOnInit(): void {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapboxKey;
    this.getMap([28.891412, 41.0256673], 14);
  }
  getPointValue(): void{     
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
  }
  clearForm() {
    this.selectedItem = [];
  }
  getShowPopup(route: DtoPolygonUser) {
    if (this.mapMarker !== undefined) {
      this.mapMarker.togglePopup();
    }
    var a = this.mapMarkers[this.users.indexOf(route)] as mapboxgl.Marker;
    a.togglePopup();
    this.mapa.flyTo({
      center: [a.getLngLat().lng, a.getLngLat().lat],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
    this.mapMarker = a;
  }
  getSelectProcess(process: number) {
    this.process = process;
  }
  getMap(coordinate: [number, number], zoom: number) {
    this.mapa = new mapboxgl.Map({
      container: 'mapa-mapbox',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinate,
      zoom: zoom,
    });
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: 'draw_polygon',
    });
    this.mapa.addControl(draw);
    this.mapa.on('draw.create', (e: any) => {
      const data = draw.getAll();

      if (data.features.length > 0) {
        var ob = Object.assign(
          {},
          {
            PUser: e['features'][0]['geometry'],
            Dates: this.selectedItem,
            OnlyTime: this.onlyTime,
            OnlyDate: this.onlyDate,
            OnlyADate: this.onlyADateTime,
            PointLength:this.pointLength
          }
        );
        this.guzergahService
          .getdrawSearch(ob, this.process)
          .subscribe((data) => {
            if (data.success) {
              this.users = data.data;
              this.deleteScrean();
              this.users.forEach((e) => {
                this.createPopup(this.mapa, e);
              });
            }
          });
      }
    });
    this.mapa.on('draw.update', (e: any) => {
      const data = draw.getAll();
      if (data.features.length > 0) {
        var ob = Object.assign(
          {},
          {
            PUser: e['features'][0]['geometry'],
            Dates: this.selectedItem,
            OnlyTime: this.onlyTime,
            OnlyDate: this.onlyDate,
            OnlyADate: this.onlyADateTime,
            PointLength:this.pointLength
          }
        );
        this.guzergahService.getdrawSearch(ob, this.process).subscribe(
          (data) => {
            if (data.success) {
              this.users = data.data;
              this.deleteScrean();
              this.users.forEach((e) => {
                this.createPopup(this.mapa, e);
              });
            }
          },
          (dataError) => {
            this.toastrService.info('Veri Bulunamadı');
            this.users = [];
            this.deleteScrean();
          }
        );
      } else {
        if (e.type !== 'draw.delete') alert('Click the map to draw a polygon.');
      }
    });
    this.mapa.on('draw.delete', (e: any) => {
      this.deleteScrean();
      this.users = [];
    });
  }
  deleteScrean() {
    this.mapMarkers.forEach((m: any) => m.remove());
    this.mapMarkers = [];
    this.mapMarker = this.mapMarkers[0];
  }
  createPopup(map: mapboxgl.Map, route: DtoPolygonUser) {
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      '<h5>Name :' +
        route.name +
        ' ' +
        route.surname +
        '</h5> <b>Email : </b>' +
        route.email +
        '<br/><b>Route Date :</b> ' +
        formatDate(route.routestartdate, 'dd/MM/yyyy', 'en-US') +
        '<br/> <b> Route Time :</b> ' +
        route.routetime
    );

    // create DOM element for the marker
    const el = document.createElement('div');
    el.id = 'marker';

    // create the marker
    let marker = new mapboxgl.Marker({
      draggable: false,
      color: '#' + (Math.random().toString(16) + '000000').substring(2, 8),
    })
      .setLngLat([route.route.coordinates[0], route.route.coordinates[1]])
      .setPopup(popup) // sets a popup on this marker
      .addTo(map);
    this.mapMarkers.push(marker);
  }
 
}
