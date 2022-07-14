import Moralis from "moralis";
import {ProfileAvatar} from "../@enums/profile-avatar";

export class User {
  moralisUserInstance?: Moralis.User
  address: string;
  avatar: ProfileAvatar;
  avatarBackgroundColor: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}
