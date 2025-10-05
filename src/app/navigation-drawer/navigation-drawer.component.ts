import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-navigation-drawer',
  standalone: true,
  templateUrl: './navigation-drawer.component.html',
  styleUrls: ['./navigation-drawer.component.css']
})
export class NavigationDrawerComponent {
  @Input() activeSection: string = 'transactions';
  @Output() sectionChange = new EventEmitter<string>();

  selectSection(section: string) {
    this.sectionChange.emit(section);
  }
}
