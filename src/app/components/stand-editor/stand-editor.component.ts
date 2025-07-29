import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Stand } from 'src/app/models/stand.model';

@Component({
  selector: 'app-stand-editor',
  templateUrl: './stand-editor.component.html',
  styleUrls: ['./stand-editor.component.scss']
})
export class StandEditorComponent {
  @Input() stand!: Stand;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Stand>();
  @Output() onBuy = new EventEmitter<string>();

  save(): void {
    this.onSave.emit(this.stand);
  }

  buy(): void {
    this.onBuy.emit(this.stand.id);
  }
}
