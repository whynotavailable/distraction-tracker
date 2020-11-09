import {Component, OnInit} from '@angular/core';

interface Period {
  start: number;
  end: number;
}

interface Tracker {
  name: string;
  periods: Period[];
  currentPeriod: Period;
  state: 'on' | 'off';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  trackers: Tracker[] = [];

  activeTracker: Tracker = null;

  addTrackerText = '';

  ngOnInit(): void {
    this.trackers = JSON.parse(localStorage.getItem('trackers') || '[]');
    const active = this.trackers.filter(x => x.state === 'on');
    this.activeTracker = active.length > 0 ? active[0] : null;
  }

  addTracker(): void {
    this.trackers.push({
      name: this.addTrackerText,
      periods: [],
      currentPeriod: null,
      state: 'off'
    });

    this.addTrackerText = '';

    this.persist();
  }

  start(tracker: Tracker): void {
    if (this.activeTracker !== null) {
      this.stop(this.activeTracker);
    }

    tracker.currentPeriod = {
      start: Date.now(),
      end: null
    };

    tracker.state = 'on';

    this.activeTracker = tracker;

    this.persist();
  }

  stop(tracker: Tracker): void {
    tracker.currentPeriod.end = Date.now();

    tracker.periods.push(tracker.currentPeriod);

    tracker.currentPeriod = null;

    tracker.state = 'off';

    this.activeTracker = null;

    this.persist();
  }

  delete(tracker: Tracker): void {
    if (!confirm('are you sure?')) {
      return;
    }

    if (tracker.state === 'on') {
      this.stop(tracker);
    }

    this.trackers = this.trackers.filter(x => x !== tracker);

    this.persist();
  }

  persist(): void {
    localStorage.setItem('trackers', JSON.stringify(this.trackers));
  }
}
