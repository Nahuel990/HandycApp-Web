import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import {
    AuthService,
    FacebookLoginProvider,
    GoogleLoginProvider
} from 'angular-6-social-login';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {

	constructor( private socialAuthService: AuthService,
				private router: Router ) {
    	localStorage.removeItem('userId');
    	localStorage.removeItem('userName');
    	localStorage.removeItem('userEmail');
    	localStorage.removeItem('userToken');
    	localStorage.removeItem('userImage');
    	localStorage.removeItem('userProvider');
	}


	public socialSignIn(socialPlatform : string) {
	    let socialPlatformProvider;
	 	if(socialPlatform == "google"){
	      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
	    }

	    this.socialAuthService.signIn(socialPlatformProvider).then(
	      (userData) => {
	        if (userData.id == null){
	        	this.router.navigate(['login']);
	        	localStorage.removeItem('userId');
	        	localStorage.removeItem('userName');
	        	localStorage.removeItem('userEmail');
	        	localStorage.removeItem('userToken');
	        	localStorage.removeItem('userImage');
	        	localStorage.removeItem('userProvider');
	        }else{
	        	this.router.navigate(['mapa']);
	        	localStorage.setItem('userId', userData.id);
	        	localStorage.setItem('userName', userData.name);
	        	localStorage.setItem('userEmail', userData.email);
	        	localStorage.setItem('userToken', userData.token);
	        	localStorage.setItem('userImage', userData.image);
	        	localStorage.setItem('userProvider', userData.provider);
	        }
	      }
	    );
	}

  ngOnInit() {
  }

}
