import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupsOverviewPage } from './groups-overview.page';

describe('GroupsOverviewPage', () => {
  let component: GroupsOverviewPage;
  let fixture: ComponentFixture<GroupsOverviewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GroupsOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
