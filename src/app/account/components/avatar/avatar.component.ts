import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarService } from '../../services/avatar/avatar.service';
import { AlertService } from '../../../shared/services/alert/alert.service';

@Component({
  selector: 'app-avatar',
  imports: [
    NgClass
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class AvatarComponent {
  avatar: any = 'assets/images/avatar/Avatar.png';

  isUploadAvatar: boolean = false;
  isDragOver: boolean = false;
  selectedFile: File | null = null;
  errorFileMessage: string = '';
  allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  maxSizeFile = 3 * 1024 * 1024;

  constructor (
    private avatarService: AvatarService,
    private alertService: AlertService,
  ) {
    this.getAvatar();
  }

  processFile(file: File) {
    this.errorFileMessage = '';
    
    if (!this.allowedTypes.includes(file.type)) {
      this.errorFileMessage = 'Solo se permiten archivos de imagen (PNG, JPEG, JPG, WEBP)';
      return;
    }

    if (file.size > this.maxSizeFile) {
      this.errorFileMessage = 'El archivo no debe superar los 3MB';
      return;
    }

    this.selectedFile = file;
    this.uploadFile();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file)
      this.processFile(file);
  }

  getAvatar() {
    this.avatarService.getAvatar().subscribe({
      next: (blob) => {
        this.avatar = URL.createObjectURL(blob);
      },
      error: () => {
        this.avatar = 'assets/images/avatar/Avatar.png';
      }
    })
  }

  uploadFile() {
    var alertBody = null;

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profileImage', this.selectedFile, this.selectedFile.name);

      this.avatarService.uploadAvatar(formData).subscribe({
        next: (response) => {
          this.getAvatar();
          this.toggleProfilePhoto();

          alertBody = {
            type: 'okay',
            title: '¡Felicidades!',
            message: response.message,
          };
  
          this.alertService.showAlert(alertBody);
        },
        error: () => {
          // alertBody = {
          //   type: 'error',
          //   title: '¡Error!',
          //   message: response.message,
          // };
  
          // this.alertService.showAlert(alertBody);
        }
      })
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    
    let file = null;
    if (files && files?.length == 1) {
      file = files[0];
      if (file)
        this.processFile(file);
    } else if (files && files.length > 1) {
      this.errorFileMessage = 'Solo se permite subir un archivo';
      return;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  toggleProfilePhoto(event?: Event) {
    if (event) 
      event.stopPropagation();
    
    this.errorFileMessage = '';
    this.isUploadAvatar = !this.isUploadAvatar;
  }
}
