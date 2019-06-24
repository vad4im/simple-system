import {Component, OnInit, ViewChild} from '@angular/core';
import {LayoutService} from '../../services/layout-service';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  opened: boolean;
  shouldRun = true;
  @ViewChild('sidenavLeft') sidenavLeft: MatSidenav;

  constructor(public layoutService: LayoutService) {
    this.layoutService.toggleSidenavLeft.subscribe(() => {
      this.sidenavLeft.toggle();
    });

  }

  ngOnInit() {
  }

}
