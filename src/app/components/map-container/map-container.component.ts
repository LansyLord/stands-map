import { Component } from '@angular/core';
import { StandService } from '../../services/stand.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Stand } from 'src/app/models/stand.model';

@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.scss']
})
export class MapContainerComponent {
  stands$ = this.standService.stands$;
  selectedStand: Stand | null = null;

  constructor(private standService: StandService) { }

  openNewStandEditor(): void {
    this.selectedStand = {
      id: '',
      name: '',
      description: '',
      logoUrl: '',
      status: 'available',
      position: { x: 20, y: 20 }
    };
  }

  onStandMoved(event: CdkDragEnd, standId: string): void {
    const newPosition = event.source.getFreeDragPosition();
    this.standService.updateStandPosition(standId, newPosition);
  }

  selectStand(stand: Stand): void {
    this.selectedStand = { ...stand };
  }

  closeEditor(): void {
    this.selectedStand = null;
  }

  saveStandChanges(standToSave: Stand): void {
    if (standToSave.id) {
      this.standService.updateStand(standToSave);
    } else {
      this.standService.addStand(standToSave);
    }
    this.closeEditor();
  }

  buyStand(standId: string): void {
    this.standService.buyStand(standId);
    this.closeEditor();
  }
}