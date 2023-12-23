import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feature-button-admin',
  templateUrl: './feature-button.component.html',
  styleUrls: ['./feature-button.component.css']
})
export class FeatureButtonComponent {
  @Input() title: string = '';
  @Input() link: string = '';
  @Input() description: string = '';
  @Input() imageUrl: string = '';

  constructor() {
    this.link = '/' + this.link;
  }
}
