import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Guzergah } from 'src/app/models/guzergah';
import { GuzergahService } from 'src/app/services/guzergah.service';

import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { GuzergahDetay } from 'src/app/models/guzergahDetay';

@Component({
  selector: 'app-guzergah',
  templateUrl: './guzergah.component.html',
  styleUrls: ['./guzergah.component.css'],
})
export class GuzergahComponent implements OnInit {
  routes: Guzergah[] = [];
  routeDetay: GuzergahDetay;
  mapa: mapboxgl.Map;
  constructor(
    private guzergahService: GuzergahService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // mapboxgl.accessToken=environment.mapboxKey;

    this.activatedRoute.params.subscribe((params) => {
      if (params['userId']) {
        this.getListMap(params['userId']);
      }
    });
  }
  creatPopup(coordinates: GeoJSON.Geometry) {
    const popup = new mapboxgl.Popup({ offset: [0, -15] })
      .setLngLat(coordinates.bbox?.values.arguments)
      .setHTML(`<h3>dnee</h3><p>içeril</p>`)
      .addTo(this.mapa);
  }
  crearMarcador(coordinate: [number, number]) {
    const marker = new mapboxgl.Marker({
      draggable: false,
    })
      .setLngLat(coordinate)
      .addTo(this.mapa);
  }
  creatLine(routeDetay: GuzergahDetay) {
    this.mapa.once('idle', () => {
      this.mapa.addSource('route', {
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
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#555',
          'line-width': 8,
        },
      });
    });
  }
  getListMap(userId: number) {
    this.guzergahService.getUserGuzergah(userId).subscribe((response) => {
      this.routes = response.data;
      (mapboxgl as typeof mapboxgl).accessToken = environment.mapboxKey;
      this.getMap([28.891412, 41.0256673], 14);
    });
  }
  getMap(coordinate: [number, number], zoom: number) {
    this.mapa = new mapboxgl.Map({
      container: 'mapa-mapbox',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinate,
      zoom: zoom,
    });
  }
  getRouteDetailLine(route: Guzergah) {
    this.guzergahService.getGuzergahDetay(route.id).subscribe((response) => {
      this.routeDetay = response.data;
      console.log(this.routeDetay.yol);
      if (this.routeDetay.yol != null) {
        this.getMap(this.routeDetay.yol.coordinates[0], 15);
        this.crearMarcador(this.routeDetay.yol.coordinates[0]);
        this.crearMarcador(
          this.routeDetay.yol.coordinates[
            this.routeDetay.yol.coordinates.length - 1
          ]
        );
        this.creatLine(this.routeDetay);
      }
    });
  }
}
