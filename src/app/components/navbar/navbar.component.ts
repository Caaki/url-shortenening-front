import {Component, Input} from '@angular/core';
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {User} from "../../interface/user";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router, private userService:UserService) {}
  @Input() user: User;
  logOut(): void{



    this.userService.logOut()
    this.router.navigate(["/login"])
  }

}
