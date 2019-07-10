import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  AngularFireUploadTask,
  AngularFireStorage
} from "angularfire2/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DialogManagerService } from "src/app/services/dialog-manager.service";
import { Service } from "src/app/models/Service";

@Component({
  selector: "app-add-service",
  templateUrl: "./add-service.component.html",
  styleUrls: ["./add-service.component.scss"]
})
export class AddServiceComponent implements OnInit {
  classification: Array<string> = ["Tour", "Comida", "Arte y Cultura", "Otro"];
  addServiceFG: FormGroup;

  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Download URL
  downloadURLS: Array<string> = [];

  location: JSON;

  // State for dropzone CSS toggling
  isHovering: boolean;
  constructor(
    private storage: AngularFireStorage,
    private _fb: FormBuilder,
    private _dialog: DialogManagerService
  ) {
    this.addServiceFG = this._fb.group({
      name: ["", Validators.required],
      classification: ["", Validators.required],
      additional_info: ["", Validators.required],
      phone: ["", Validators.required],
      email: ["", Validators.required]
    });
  }

  ngOnInit() {}

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    this.upload(Array.from(event));
  }

  upload(files) {
    if (files.length === 0) {
      this.percentage = undefined;
      return;
    }
    //console.log(files[0])
    // Client-side validation example
    /*if (file.type.split("/")[0] !== "image") {
      console.error("unsupported file type :( ");
      return;
    }*/

    // The storage path
    const path = `${new Date().getTime()}_${files[0].name}`;

    // Totally optional metadata
    const customMetadata = { app: "Ruta Turistica del norte" };

    // The main task
    this.task = this.storage.upload(path, files[0], { customMetadata });
    this.percentage = this.task.percentageChanges();
    this.task
      .then(() => {
        console.log("success");
        files.splice(0, 1);
        this.upload(files);
      })
      .catch(err => console.error(err));

    // Progress monitoring
    this.snapshot = this.task.snapshotChanges();

    // The file's download URL
    this.snapshot
      .pipe(
        finalize(() => {
          this.storage
            .ref(path)
            .getDownloadURL()
            .subscribe(url => this.downloadURLS.push(url));
        })
      )
      .subscribe();
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return (
      snapshot.state === "running" &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

  onSubmit() {
    console.log(
      new Service(
        JSON.stringify(this.location),
        this.addServiceFG.get("name").value,
        this.addServiceFG.get("classification").value,
        this.addServiceFG.get("additional_info").value,
        this.addServiceFG.get("phone").value,
        this.addServiceFG.get("email").value,
        this.downloadURLS
      )
    );
  }

  pickLocation() {
    this._dialog
      .openPickLocationDialog()
      .subscribe(location => (this.location = location));
  }
}