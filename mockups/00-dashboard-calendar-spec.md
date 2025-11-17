# Dashboard Calendar Widget - Google Calendar Style Specification
**Reference:** Google Calendar Month View
**For:** CommandCentered Dashboard (00-dashboard.html)

---

## Visual Example

```
┌─────────────────────────────────────────────────────────────────┐
│ DECEMBER 2025                                   [⟳] [<] [>]     │
├─────┬─────┬─────┬─────┬─────┬─────┬─────┐                      │
│ Sun │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │                      │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤                      │
│     │     │     │     │     │     │     │                      │
│  1  │  2  │  3  │  4  │  5  │  6  │  7  │                      │
│     │     │     │     │     │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│     │     │     │     │     │ EMPWR Dance Recital          ┃ │
│     │     │     │     │     │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤                      │
│  8  │  9  │ 10  │ 11  │ 12  │ 13  │ 14  │                      │
│━━━━━━━━━━━┓     │     │     │━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓     │
│ Glow Comp ┃     │     │     │ Holiday Party            ┃     │
│━━━━━━━━━━━┛     │     │     │━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛     │
│ Studio X  │     │     │     │     │━━━━━━━━━━━━━┓              │
│           │     │     │     │     │ Dance Fest ┃              │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤     ┃              │
│ 15  │ 16  │ 17  │ 18  │ 19  │ 20  │ 21  │     ┃              │
│     │     │     │━━━━━━┓     │     │     │━━━━━━┛              │
│     │     │     │ Corp ┃     │     │     │                      │
│     │     │     │━━━━━━┛     │     │     │                      │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘                      │
│                                                                  │
│ Legend: █ Confirmed  █ Pending  █ Completed  █ Cancelled        │
└─────────────────────────────────────────────────────────────────┘
```

---

## CSS Implementation

```css
/* Calendar Container */
.calendar-widget {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 12px;
  padding: 20px;
}

/* Month Grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: rgba(71, 85, 105, 0.2);
  border: 1px solid rgba(71, 85, 105, 0.3);
}

/* Day Headers */
.day-header {
  padding: 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  background: rgba(15, 23, 42, 0.8);
}

/* Day Cells */
.day-cell {
  min-height: 80px;
  padding: 4px;
  background: rgba(15, 23, 42, 0.4);
  position: relative;
  overflow: visible; /* Allow events to span across cells */
}

.day-number {
  font-size: 12px;
  color: #cbd5e1;
  margin-bottom: 4px;
}

/* Event Bars (Google Calendar Style) */
.event-bar {
  position: absolute;
  height: 20px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 500;
  color: white;
  border-radius: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Multi-day events span across grid */
.event-bar.span-2 { width: calc(200% + 1px); }
.event-bar.span-3 { width: calc(300% + 2px); }
.event-bar.span-4 { width: calc(400% + 3px); }
.event-bar.span-5 { width: calc(500% + 4px); }
.event-bar.span-6 { width: calc(600% + 5px); }
.event-bar.span-7 { width: calc(700% + 6px); }

/* Stacking multiple events */
.event-bar:nth-child(2) { top: 28px; }
.event-bar:nth-child(3) { top: 52px; }
.event-bar:nth-child(4) { top: 76px; }

/* Event Status Colors (Google Calendar inspired) */
.event-bar.confirmed {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
}

.event-bar.pending {
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
}

.event-bar.completed {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.event-bar.cancelled {
  background: linear-gradient(90deg, #6b7280 0%, #4b5563 100%);
  text-decoration: line-through;
  opacity: 0.7;
}

/* Hover State */
.event-bar:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

/* Event Icons */
.event-bar::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 12px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1px;
  margin-right: 6px;
}

/* Today Highlight */
.day-cell.today {
  background: rgba(6, 182, 212, 0.1);
  border: 2px solid rgba(6, 182, 212, 0.5);
}

.day-cell.today .day-number {
  background: #06b6d4;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Tooltip on Hover */
.event-tooltip {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: rgba(15, 23, 42, 0.98);
  border: 1px solid rgba(6, 182, 212, 0.5);
  border-radius: 8px;
  padding: 12px;
  min-width: 250px;
  z-index: 1000;
  display: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.event-bar:hover .event-tooltip {
  display: block;
}

.event-tooltip h4 {
  color: #06b6d4;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.event-tooltip .detail {
  font-size: 12px;
  color: #cbd5e1;
  margin: 4px 0;
}

.event-tooltip .operators {
  color: #10b981;
}

.event-tooltip .kits {
  color: #a855f7;
}
```

---

## HTML Structure

```html
<div class="calendar-widget">
  <div class="calendar-header">
    <h3>December 2025</h3>
    <div class="calendar-controls">
      <button class="refresh">⟳</button>
      <button class="prev"><</button>
      <button class="next">></button>
    </div>
  </div>

  <div class="calendar-grid">
    <!-- Headers -->
    <div class="day-header">Sun</div>
    <div class="day-header">Mon</div>
    <div class="day-header">Tue</div>
    <div class="day-header">Wed</div>
    <div class="day-header">Thu</div>
    <div class="day-header">Fri</div>
    <div class="day-header">Sat</div>

    <!-- Week 1 -->
    <div class="day-cell">
      <div class="day-number">1</div>
    </div>
    <div class="day-cell">
      <div class="day-number">2</div>
    </div>
    <div class="day-cell">
      <div class="day-number">3</div>
    </div>
    <div class="day-cell">
      <div class="day-number">4</div>
    </div>
    <div class="day-cell">
      <div class="day-number">5</div>
    </div>
    <div class="day-cell">
      <div class="day-number">6</div>
      <!-- Multi-day event starting here -->
      <div class="event-bar confirmed span-2">
        EMPWR Dance Recital
        <div class="event-tooltip">
          <h4>EMPWR Dance Recital</h4>
          <div class="detail">📍 Blue Mountain Resort</div>
          <div class="detail operators">👥 JD, ST</div>
          <div class="detail kits">📷 Kit A, Kit B</div>
          <div class="detail">⏰ 2:00 PM - 10:00 PM</div>
        </div>
      </div>
    </div>
    <div class="day-cell">
      <div class="day-number">7</div>
      <!-- Event continues but no new bar needed due to span-2 -->
    </div>

    <!-- Week 2 -->
    <div class="day-cell">
      <div class="day-number">8</div>
      <!-- Single day event -->
      <div class="event-bar confirmed">
        Glow Competition
        <div class="event-tooltip">
          <h4>Glow Dance Competition</h4>
          <div class="detail">📍 Toronto Convention Centre</div>
          <div class="detail operators">👥 MK, AL</div>
          <div class="detail kits">📷 Kit C</div>
        </div>
      </div>
      <!-- Another event same day (stacked) -->
      <div class="event-bar pending">
        Studio X Meeting
      </div>
    </div>
    <div class="day-cell">
      <div class="day-number">9</div>
    </div>
    <div class="day-cell">
      <div class="day-number">10</div>
    </div>
    <div class="day-cell">
      <div class="day-number">11</div>
    </div>
    <div class="day-cell">
      <div class="day-number">12</div>
      <!-- 3-day event -->
      <div class="event-bar pending span-3">
        Holiday Corporate Series
      </div>
    </div>
    <!-- Continue for rest of month... -->
  </div>

  <div class="calendar-legend">
    <span class="legend-item">
      <span class="legend-color confirmed">■</span> Confirmed
    </span>
    <span class="legend-item">
      <span class="legend-color pending">■</span> Pending
    </span>
    <span class="legend-item">
      <span class="legend-color completed">■</span> Completed
    </span>
    <span class="legend-item">
      <span class="legend-color cancelled">■</span> Cancelled
    </span>
  </div>
</div>
```

---

## Key Features (Google Calendar Style)

1. **Horizontal Event Bars**
   - Events appear as colored horizontal bars
   - Multi-day events span across day cells
   - Event title visible on the bar

2. **Visual Hierarchy**
   - Day numbers in top-left corner
   - Events stack vertically when multiple per day
   - Maximum 3 events visible ("+2 more" for overflow)

3. **Color Coding**
   - Blue: Confirmed events
   - Yellow: Pending events
   - Green: Completed events
   - Grey: Cancelled events

4. **Interactive Elements**
   - Hover shows full details tooltip
   - Click opens event detail modal
   - Drag to reschedule (future feature)

5. **Smart Layout**
   - Multi-day events use CSS grid spanning
   - Events don't overlap visually
   - Clean minimal design

6. **Information Density**
   - Shows essential info at a glance
   - Operators/Kits in tooltip
   - No clutter in month view

---

## JavaScript Functionality

```javascript
// Calculate event spans
function calculateEventSpan(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daySpan = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return `span-${Math.min(daySpan, 7)}`;
}

// Position events to avoid overlap
function stackEvents(dayElement) {
  const events = dayElement.querySelectorAll('.event-bar');
  events.forEach((event, index) => {
    event.style.top = `${24 + (index * 24)}px`;
  });
}

// Show "+X more" for overflow
function handleOverflow(dayElement) {
  const events = dayElement.querySelectorAll('.event-bar');
  if (events.length > 3) {
    // Hide events beyond 3rd
    for (let i = 3; i < events.length; i++) {
      events[i].style.display = 'none';
    }
    // Add "+X more" indicator
    const moreIndicator = document.createElement('div');
    moreIndicator.className = 'more-events';
    moreIndicator.textContent = `+${events.length - 3} more`;
    dayElement.appendChild(moreIndicator);
  }
}
```

---

## Responsive Behavior

```css
/* Mobile (< 768px) */
@media (max-width: 768px) {
  .calendar-grid {
    font-size: 10px;
  }

  .day-cell {
    min-height: 60px;
  }

  .event-bar {
    height: 18px;
    font-size: 10px;
  }

  /* Show only dots on mobile */
  .event-bar {
    width: 8px !important;
    height: 8px;
    border-radius: 50%;
    padding: 0;
  }

  .event-bar span {
    display: none;
  }
}
```

---

**This Google Calendar-style implementation provides:**
- Clean, professional appearance
- High information density
- Intuitive multi-day event display
- Mobile-responsive design
- Familiar UX pattern users already know

**Ready to implement this in the dashboard?**