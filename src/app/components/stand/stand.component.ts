import { Component, Input } from '@angular/core';
import { Stand } from 'src/app/models/stand.model';

@Component({
  selector: 'app-stand',
  templateUrl: './stand.component.html',
  styleUrls: ['./stand.component.scss']
})
export class StandComponent {
  @Input() standData!: Stand;
}
