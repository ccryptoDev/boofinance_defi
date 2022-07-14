import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {NbToastrService} from "@nebular/theme";
import {fadeInOnEnterAnimation} from "angular-animations";
import {Subscription} from "rxjs";
import {ProfileAvatar} from "../../@enums/profile-avatar";
import {AuthenticationService} from "../../@services/authentication.service";
import {User} from "../../@models/user";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {first, tap} from "rxjs/operators";
import {ForbiddenCharacterValidator} from "../../@validators/forbidden-character-validator";
import {HexColorValidator} from "../../@validators/hex-color-validator";
import {EnumValidator} from "../../@validators/enum-validator";
import {ToastrConfig} from "../../@configurations/toastr-config";
import {ErrorHandler} from "../../@utils/error-handler";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss'],
  styles: [':host { display: block }'],
  animations: [
    fadeInOnEnterAnimation({
      anchor: 'enter',
      duration: 350
    }),
    fadeInOnEnterAnimation({
      duration: 400,
      delay: 120
    }),
  ]
})
export class ProfileEditorComponent implements OnInit, OnDestroy {
  @HostBinding('@enter')
  // Subscriptions
  user$: Subscription;
  // Subscription variables
  user: User | null;
  redirectUrlAfterUpdate: string;
  // Loading booleans
  loadingUser: boolean = true;
  loadingUserDataUpdate: boolean = false;
  // Menu variables
  ProfileAvatarEnum = ProfileAvatar;
  form = new FormGroup({
    'nickname': new FormControl('Unknown Ghost', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(16),
      ForbiddenCharacterValidator(),
    ]),
    'backgroundColor': new FormControl('#50CC94', [
      Validators.required,
      HexColorValidator(),
    ]),
    'avatar': new FormControl(ProfileAvatar.Boofi, [
      Validators.required,
      EnumValidator(ProfileAvatar),
    ]),
  });
  defaultBackgroundColors = [
    '#C9AD66',
    '#C96666',
    '#C966A7',
    '#9166C9',
    '#6693C9',
    '#50CC94',
    '#80C966',
    '#F9E007',
    '#E72929',
    '#3F78F4',
    '#E816BA',
    '#FF9900',
    '#696A3A',
    '#66334F',
    '#28C9EC',
    '#363636',
    '#636264',
    '#ACACAC',
    '#FFFFFF'
  ];
  constructor(
    private authenticationService: AuthenticationService,
    private toastrService: NbToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.user$ = this.authenticationService.getConnectedUser().pipe(
      tap(() => {
        this.user = null;
        this.loadingUser = true;
      })
    ).subscribe(user => {
      this.user = user;
      // If the user has a Nickname available, set it on the Nickname control otherwise use the default of Unknown Ghost.
      this.nicknameControl.setValue(this.user?.nickname ? this.user.nickname : '');
      this.avatarControl.setValue(this.user?.avatar);
      this.backGroundColorControl.setValue(this.user?.avatarBackgroundColor);
      this.loadingUser = false;
    });
    // Note: activatedRoute unsubscribes automatically when the component is destroyed
    this.activatedRoute.queryParams.subscribe(params => {
      this.redirectUrlAfterUpdate = params?.redirectTo;
    });
  }

  submitUserProfile() {
    if (this.form.valid) {
      this.loadingUserDataUpdate = true;
      this.authenticationService.updateUserData({
        nickname: this.nicknameControl.value,
        avatar: this.avatarControl.value,
        avatarBackgroundColor: this.backGroundColorControl.value
      }).pipe(
        first()
      ).subscribe(response => {
        this.loadingUserDataUpdate = false;
        this.toastrService.show('Your profile has been updated successfully!', 'Success', ToastrConfig.Success);
        console.log(response);
        if (this.redirectUrlAfterUpdate) {
          this.router.navigate(['/' + this.redirectUrlAfterUpdate]);
        }
      }, error => {
        const errorMessage = ErrorHandler.getMessage(error);
        switch (errorMessage) {
          case 'Nickname already in use':
            this.nicknameControl.setErrors({
              'alreadyInUse': errorMessage
            });
            break;
          case 'Please avoid using swear words on your nickname':
            this.nicknameControl.setErrors({
              'swearWords': errorMessage
            });
            break;
        }
        this.loadingUserDataUpdate = false;
        this.toastrService.show(errorMessage, 'Error', ToastrConfig.Warning);
      });
    } else {
      this.toastrService.show('Please verify the validity of each field before continuing', 'Invalid Form', ToastrConfig.Warning);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from subscriptions to avoid memory leaks
    this.user$?.unsubscribe();
  }

  updateAvatar(newAvatar: ProfileAvatar) {
    this.avatarControl.markAsDirty();
    this.avatarControl.markAsTouched();
    this.avatarControl.setValue(newAvatar);
  }

  updateBackgroundColor(newBackgroundColor: string) {
    this.backGroundColorControl.markAsDirty();
    this.backGroundColorControl.markAsTouched();
    this.backGroundColorControl.setValue(newBackgroundColor);
  }

  get nicknameControl() {
    return this.form.controls['nickname'];
  }

  get avatarControl() {
    return this.form.controls['avatar'];
  }

  get backGroundColorControl() {
    return this.form.controls['backgroundColor'];
  }
}
