import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusyService } from '../_services/busy.service';
import { SnackbarService } from '../_services/snackbar.service';
import { AccountService } from '../_services/account.service';
import { UserService } from '../_services/user.service';
import { Photo } from '../_models/photo';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profileImageUrl: string | null = null;

  constructor(private fb: FormBuilder,private busyService: BusyService, private snackbar: SnackbarService,
              public accountService: AccountService, private userService: UserService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: ['Mohamed Wasim', Validators.required],
      email: ['mohamed.wasim@rheincs.com', [Validators.required, Validators.email]],
      mobile: ['8778853326', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  onFileSelected(event: any): void {

    const file: File = event.target.files[0];
    const formData = new FormData();
    formData.append('file',file);

    this.busyService.busy();
    this.userService.addPhoto(formData).subscribe({
      next: (response) => {
        this.busyService.idle();
        if(response.out == 1)
        {
          this.accountService.currentUser.update(user => {
            if (!user) return user;
            return {
              ...user,
              photoUrl: response.data[0]?.photoUrl,
              photoId: response.data[0]?.photoId,
              publicId: response.data[0]?.publicId
            };
          });
          localStorage.removeItem('user');
          localStorage.setItem('user',JSON.stringify(this.accountService.currentUser()));
          this.snackbar.showSuccess('Profile picture updated Successfully','bottom');
        }
        else
        {
          if(response.error)
          {
            this.snackbar.showError(response.error[0]?.errorMsg,'bottom');
          }
        }
      },
      error: (error) => {
        this.busyService.idle();
        this.snackbar.showError(error);
      },
      complete: () => {}
    })

    //following code block is to prview the image in image round container
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     this.profileImageUrl = reader.result as string;
    //   };
    //   reader.readAsDataURL(file);
    // }
  }

  onDeletePicture(): void {
    //this.profileImageUrl = null;
    let photo: Photo = {
      PhotoId:this.accountService.currentUser()?.photoId,
      PhotoUrl:this.accountService.currentUser()?.photoUrl,
      PublicId:this.accountService.currentUser()?.publicId
    };

    this.busyService.busy();
    this.userService.deletePhoto(photo).subscribe({
      next: (response) => {
        this.busyService.idle();
        if(response.out == 1)
        {
          this.accountService.currentUser.update(user => {
            if (!user) return user;
            return {
              ...user,
              photoUrl: '',
              photoId: -1,
              publicId: ''
            };
          });
          localStorage.removeItem('user');
          localStorage.setItem('user',JSON.stringify(this.accountService.currentUser()));
          this.snackbar.showSuccess('Profile picture delete successfully','bottom');
        }
        else
        {
          if(response.error)
          {
            this.snackbar.showError(response.error[0]?.errorMsg,'bottom');
          }
        }
      },
      error: (error) => {
        this.snackbar.showError(error);
      },
      complete: () => {}
    })
  }

  onUpdate(): void {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      // Add your update API logic here
    }
  }
}
