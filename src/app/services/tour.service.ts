import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material";
import { Tour } from "../models/Tour";
import { environment } from "src/environments/environment.prod";
import { Observable } from "rxjs";
import { User } from '../models/User';

@Injectable({
  providedIn: "root"
})
export class TourService {
  constructor(private _http: HttpClient, private _snackbar: MatSnackBar) {}

  getTours() {}

  saveTour(tour: Tour) {
    this._http
      .post(`${environment.SERVER_BASE_URL}saveTour`, tour)
      .subscribe(
        () => this.openSnackBar("Tour guardado con éxito", "Ok", 2500),
        (err: HttpErrorResponse) => this.handleError(err)
      );
  }

  getTour(id_tour: number): Observable<Tour> {
    return this._http.get<Tour>(
      `${environment.SERVER_BASE_URL}getTour/${id_tour}`
    );
  }

  /**
   * Get all related tours when open a specific service
   * @param related_service
   */
  getRelatedTours(related_service: number): Observable<Array<Tour>> {
    return this._http.get<Array<Tour>>(
      `${environment.SERVER_BASE_URL}getRelatedTours/${related_service}`
    );
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackbar.open(message, action, {
      duration: duration
    });
  }

  handleError(err: HttpErrorResponse) {
    if (err.error instanceof Error) {
      // Error del lado del cliente
      console.log("An error occurred:", err.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // Error del lado del backend
      console.log(
        `Backend returned code ${err.status}, body was: ${JSON.stringify(
          err.error
        )}`
      );
    }
  }
}
