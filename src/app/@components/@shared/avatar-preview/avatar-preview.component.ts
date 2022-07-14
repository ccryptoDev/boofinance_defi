import {Component, Input, OnInit} from '@angular/core';
import {ProfileAvatar} from "../../../@enums/profile-avatar";

@Component({
  selector: 'app-avatar-preview',
  templateUrl: './avatar-preview.component.html',
  styleUrls: ['./avatar-preview.component.scss']
})
export class AvatarPreviewComponent implements OnInit {
  readonly defaultBackgroundColor = '#50CC94';
  readonly defaultAvatar = ProfileAvatar.Boofi;
  ProfileAvatarEnum = ProfileAvatar;
  constructor() { }
  @Input() avatar: ProfileAvatar = this.defaultAvatar;
  @Input() backgroundHexColor: string = this.defaultBackgroundColor;
  @Input() size: 'xs'|'sm'|'md'|'lg' = 'md';
  @Input() selectable: boolean = false;
  @Input() selected: boolean = false;

  ngOnInit(): void {
  }

}
