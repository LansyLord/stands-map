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

  scale = 1;
  isPanning = false;

  mapOffsetX = 0;
  mapOffsetY = 0;

  private panStartX = 0;
  private panStartY = 0;


  constructor(private standService: StandService) { }

  get mapTransform(): string {
    return `translate(${this.mapOffsetX}px, ${this.mapOffsetY}px) scale(${this.scale})`;
  }


  onWheel(event: WheelEvent): void {
    event.preventDefault();

    const scaleAmount = 0.1;
    if (event.deltaY > 0) {
      this.scale = Math.max(0.3, this.scale - scaleAmount);
    } else {
      this.scale = Math.min(2.5, this.scale + scaleAmount);
    }
  }

  onMouseDown(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('app-stand')) {
      return;
    }
    event.preventDefault();
    this.isPanning = true;
    this.panStartX = event.clientX;
    this.panStartY = event.clientY;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isPanning) {
      return;
    }
    event.preventDefault();

    const dx = event.clientX - this.panStartX;
    const dy = event.clientY - this.panStartY;

    this.mapOffsetX += dx;
    this.mapOffsetY += dy;

    this.panStartX = event.clientX;
    this.panStartY = event.clientY;
  }

  onMouseUp(): void {
    this.isPanning = false;
  }

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