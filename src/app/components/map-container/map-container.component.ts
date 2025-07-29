import { Component, ElementRef, ViewChild } from '@angular/core';
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


  @ViewChild('fileInput') fileInput!: ElementRef;

  @ViewChild('mapArea') mapAreaRef!: ElementRef<HTMLDivElement>;

  mapBackgroundUrl: string | null = null;

  mapWidth: number | null = null;
  mapHeight: number | null = null;


  constructor(private standService: StandService) { }

  get mapTransform(): string {
    return `translate(${this.mapOffsetX}px, ${this.mapOffsetY}px) scale(${this.scale})`;
  }

  get dynamicMapStyle() {
    if (this.mapWidth && this.mapHeight) {
      return {
        'width.px': this.mapWidth,
        'height.px': this.mapHeight,
      };
    }
    return {};
  }

  resetView(): void {
    this.scale = 1;
    this.mapOffsetX = 0;
    this.mapOffsetY = 0;
  }

  removeBackground(): void {
    this.mapBackgroundUrl = null;
    this.mapWidth = null;
    this.mapHeight = null;
    this.resetView();
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

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.mapBackgroundUrl = dataUrl;

        const img = new Image();
        img.onload = () => {

          const container = this.mapAreaRef.nativeElement;
          const maxWidth = container.clientWidth;
          const maxHeight = container.clientHeight;

          const imageRatio = img.naturalWidth / img.naturalHeight;
          const containerRatio = maxWidth / maxHeight;

          if (imageRatio > containerRatio) {
            this.mapWidth = maxWidth;
            this.mapHeight = maxWidth / imageRatio;
          } else {
            this.mapHeight = maxHeight;
            this.mapWidth = maxHeight * imageRatio;
          }
        };
        img.src = dataUrl;
        this.resetView();
      };
      reader.readAsDataURL(file);
      input.value = '';
    }
  }
}