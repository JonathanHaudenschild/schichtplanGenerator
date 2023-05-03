import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipantsPage } from './participants.page';

describe('ParticipantsPage', () => {
  let component: ParticipantsPage;
  let fixture: ComponentFixture<ParticipantsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParticipantsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
