import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Service } from "src/app/models/Service";
import { ToursService } from "src/app/services/tours.service";

@Component({
  selector: "app-tour",
  templateUrl: "./service.component.html",
  styleUrls: ["./service.component.scss"]
})
export class TourComponent implements OnInit {
  tour: Service;
  public degree = 45;
  public moreSlides = 1;
  constructor(
    private _tours: ToursService,
    private route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    if (this.route.snapshot.paramMap.get("id"))
      this.tour = this._tours.tours[Number(this.route.snapshot.paramMap.get("id"))];
    else this._router.navigate["/general/tours"];
  }
}