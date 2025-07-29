import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Stand } from '../models/stand.model';

@Injectable({
  providedIn: 'root'
})
export class StandService {
  // '_' e '$' são convenções para streams/observables privados
  private readonly _stands$ = new BehaviorSubject<Stand[]>([]);

  // Expondo o Observable publicamente (somente para leitura)
  public readonly stands$ = this._stands$.asObservable();

  constructor() {
    // Carga inicial de dados para teste
    this.loadInitialStands();
  }

  private loadInitialStands(): void {
    const initialStands: Stand[] = [
      { id: '1', name: 'Stand A', description: 'Descrição A', status: 'available', position: { x: 50, y: 50 } },
      { id: '2', name: 'Stand B', description: 'Descrição B', logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/732px-Apple_logo_black.svg.png", status: 'available', position: { x: 200, y: 100 } },
    ];
    this._stands$.next(initialStands);
  }

  // Método para adicionar um novo stand
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
      // Criar um novo array para imutabilidade e detecção de mudanças
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
      // Marca como ocupado
      newStands[index] = { ...newStands[index], status: 'occupied' };
      this._stands$.next(newStands);
    }
  }
}