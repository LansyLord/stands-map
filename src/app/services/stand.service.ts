import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Stand } from '../models/stand.model';

@Injectable({
  providedIn: 'root'
})
export class StandService {
  private readonly _stands$ = new BehaviorSubject<Stand[]>([]);

  public readonly stands$ = this._stands$.asObservable();

  constructor() {
    this.loadInitialStands();
  }

  private loadInitialStands(): void {
    const initialStands: Stand[] = [
      { id: '1', name: 'Razer', description: 'Descrição A', logoUrl: "https://cdn.worldvectorlogo.com/logos/razer.svg", status: 'available', position: { x: 50, y: 50 } },
      { id: '2', name: 'Apple', description: 'Descrição B', logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/732px-Apple_logo_black.svg.png", status: 'available', position: { x: 200, y: 100 } },
      { id: '3', name: 'Acer', description: 'Descrição C', logoUrl: "https://logodownload.org/wp-content/uploads/2014/09/acer-logo-1.png", status: 'occupied', position: { x: 300, y: 200 } },

    ];
    this._stands$.next(initialStands);
  }

  addStand(standData: Omit<Stand, 'id'>): void {
    const currentStands = this._stands$.getValue();

    const standToAdd: Stand = {
      ...standData,
      id: new Date().getTime().toString()
    };

    this._stands$.next([...currentStands, standToAdd]);
  }

  updateStandPosition(id: string, newPosition: { x: number; y: number }): void {
    const currentStands = this._stands$.getValue();
    const standIndex = currentStands.findIndex(s => s.id === id);

    if (standIndex > -1) {
      const updatedStands = [...currentStands];
      updatedStands[standIndex] = { ...updatedStands[standIndex], position: newPosition };
      this._stands$.next(updatedStands);
    }
  }

  updateStand(updatedStand: Stand): void {
    const stands = this._stands$.getValue();
    const index = stands.findIndex(s => s.id === updatedStand.id);
    if (index !== -1) {
      const newStands = [...stands];
      newStands[index] = updatedStand;
      this._stands$.next(newStands);
    }
  }

  buyStand(id: string): void {
    const stands = this._stands$.getValue();
    const index = stands.findIndex(s => s.id === id);
    if (index !== -1) {
      const newStands = [...stands];
      newStands[index] = { ...newStands[index], status: 'occupied' };
      this._stands$.next(newStands);
    }
  }
}