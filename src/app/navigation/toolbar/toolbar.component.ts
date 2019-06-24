import { Component, OnInit } from '@angular/core';
import {LayoutService} from '../../services/layout-service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  shouldRun = true;
  constructor(public layoutService: LayoutService) { }

  public toggleSidenav() {
    this.layoutService.toggleSidenavLeft.emit();
  }

  ngOnInit() {
  }

}
