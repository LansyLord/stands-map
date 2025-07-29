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
  stands$ = this.standService.stands$; // Async pipe vai lidar com a inscrição
  selectedStand: Stand | null = null;

  constructor(private standService: StandService) { }

  addNewStand(): void {
    this.standService.addStand();
  }

  onStandMoved(event: CdkDragEnd, standId: string): void {
    const newPosition = event.source.getFreeDragPosition();
    this.standService.updateStandPosition(standId, newPosition);
  }

  selectStand(stand: Stand): void {
    // Criamos uma cópia para evitar alteração direta no objeto original
    this.selectedStand = { ...stand };
  }

  closeEditor(): void {
    this.selectedStand = null;
  }

  saveStandChanges(updatedStand: Stand): void {
    this.standService.updateStand(updatedStand);
    this.closeEditor();
  }

  buyStand(standId: string): void {
    this.standService.buyStand(standId);
    this.closeEditor();
  }
}