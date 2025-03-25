// // Angular import
// import { Component, EventEmitter, Output } from '@angular/core';

// @Component({
//   selector: 'app-navigation',
//   templateUrl: './navigation.component.html',
//   styleUrls: ['./navigation.component.scss']
// })
// export class NavigationComponent {
//   // public props
//   @Output() NavCollapsedMob = new EventEmitter();
//   windowWidth = window.innerWidth;

//   // public method
//   navCollapseMob() {
//     if (this.windowWidth < 1025) {
//       this.NavCollapsedMob.emit();
//     }
//   }
// }
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ApiService } from 'src/app/user/services/api.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Output() NavCollapsedMob = new EventEmitter();
  windowWidth = window.innerWidth;
  pendingPoisCount:any; // Initialize count

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getPendingPoisCount();
  }

  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }

  getPendingPoisCount() {
    this.api.getPendingPois().subscribe({
      next: (response: any) => {
        if (response.status && response.pending_pois_count > 0) {
          this.pendingPoisCount = response.pending_pois_count;
          document.getElementById("pending_request").classList.add("pending_request");
          document.getElementById("pending_request").innerHTML = this.pendingPoisCount;
        }
      },
      error: (err) => {
        console.error('Error fetching pending POIs:', err);
        this.pendingPoisCount = 0;
      }
    });
  }
}