import { Component, OnInit } from '@angular/core';
import { Header } from '../../component/header/header';
import { Sidebar } from '../../component/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, RouterOutlet, MatSidenavModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // collapsed = true;
  // isInit = true;
  // ngOnInit() {
  //   setTimeout(() => {
  //     this.isInit = false;
  //   }, 100);
  // }
}
