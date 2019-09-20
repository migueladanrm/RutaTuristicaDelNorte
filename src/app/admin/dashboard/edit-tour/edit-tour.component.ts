import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TourService } from "src/app/services/tour.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { Services } from "src/app/services/services.service";
import { startWith, map } from "rxjs/operators";

@Component({
  selector: "app-edit-tour",
  templateUrl: "./edit-tour.component.html",
  styleUrls: ["./edit-tour.component.scss"]
})
export class EditTourComponent implements OnInit {
  t: any;
  filteredServices: Observable<any[]>;
  servicesNames: Array<any>;
  serviceCtrl = new FormControl();
  tourImages: Array<string>;

  constructor(
    private _active: ActivatedRoute,
    private _tour: TourService,
    private _service: Services
  ) {}

  ngOnInit() {
    let id_tour = this._active.snapshot.paramMap.get("id_tour");
    if (id_tour)
      this._tour.getTour(Number(id_tour)).subscribe(
        tour => {
          this.t = tour;
          console.log(this.t);
          this.getToursNames();
        },
        (err: HttpErrorResponse) => this._tour.handleError(err)
      );
  }

  configFormControl() {
    this.filteredServices = this.serviceCtrl.valueChanges.pipe(
      startWith(""),
      map(value => this._filterTours(value))
    );
  }

  private _filterTours(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.servicesNames.filter(service =>
      service.name.toLowerCase().includes(filterValue)
    );
  }

  getTourImages() {
    console.log(this.t.id);
    this._tour.getTourImages(this.t.id).subscribe({
      next: images => {this.tourImages = images; console.log(this.tourImages)},
      error: err => this._tour.handleError(err)
    });
  }

  getToursNames() {
    this._service.getServicesNames().subscribe({
      next: data => {
        this.servicesNames = data;
        this.getTourImages();
        this.configFormControl();
      },
      error: err => this._service.handleError(err)
    });
  }

  addPhone(phone) {
    this.t.phones.phones.unshift(phone);
  }

  onSubmit() {
    this._tour.updateTour(this.t).subscribe({
      next: () =>
        this._tour.openSnackBar("Tour actualizado con éxito", "Ok", 2500),
      error: err => this._tour.handleError(err)
    });
  }

  deleteRelatedService() {
    this._tour.deleteRelatedService().subscribe({
      next: () => {
        this._tour.openSnackBar("Servicio relacionado eliminado", "Ok", 2000);
        this.t.related_service = undefined;
        this.t.service_name = undefined;
      },
      error: (err: HttpErrorResponse) => this._tour.handleError(err)
    });
  }

  linkRelated() {
    let newRelated = this.servicesNames.find(
      s => s.name === this.serviceCtrl.value
    );
    newRelated ? (this.t.related_service = newRelated.id) : null;
  }
}