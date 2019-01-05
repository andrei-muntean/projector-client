import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../requests.service';
import { IPresentation } from '../models';

@Component({
  selector: 'app-projector-start-page',
  templateUrl: './projector-start-page.component.html',
  styleUrls: ['./projector-start-page.component.css']
})
export class ProjectorStartPageComponent implements OnInit {

  isFound = true;
  isLoading = false;
  isOwnerPresent = false;
  usersOnline = 0;
  uploadText = 'Upload Your Presentation';
  runningFileName = 'Running File Name';
  private presentation: IPresentation = {};

  constructor(private _requestService: RequestsService) { }

  ngOnInit() {
    this._requestService.getStats().subscribe((data: any) => {
      console.log(data);
    });
  }

  fileChanged(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      // set file name
      this.presentation.fileName = file.name;
      // update upload text
      this.uploadText = file.name;
      const reader = new FileReader();
      reader.onload = e => {
        // set upload file
        this.presentation.uploadFile = reader.readAsDataURL(file);
      };
      reader.readAsDataURL(file);
      console.log(file);
    }
  }
  /**
   * Get base 64 of a text
   * @param text just the base64 content from the string
   */
  getBase64(text: string): string {
    return text.split(',')[1];
  }
  /**
   * Upload presentation and start it
   */
  upload() {
    this.isLoading = true;
    this._requestService.postPresentation(this.presentation).subscribe(response => {
      console.log(response);
      // TODO if response is succesful navigate to next page
      // else stay on this and show an error
    });
  }
  /**
   * connect to running room
   */
  connect() {
    this.isLoading = true;
    // TODO
  }
}
