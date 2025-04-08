import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilBearbeitenOverlayComponent } from './profil-edit-overlay.component';

describe('ProfilBearbeitenOverlayComponent', () => {
  let component: ProfilBearbeitenOverlayComponent;
  let fixture: ComponentFixture<ProfilBearbeitenOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilBearbeitenOverlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilBearbeitenOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
