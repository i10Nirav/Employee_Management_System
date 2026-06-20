import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../core/services/employee.service';
import { DashboardStats } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Dashboard</h1>

    @if (stats()) {
      <div class="stat-grid">
        <div class="card stat">
          <span class="label">Total Employees</span>
          <span class="value">{{ stats()!.totalEmployees }}</span>
        </div>
        <div class="card stat">
          <span class="label">Active</span>
          <span class="value active">{{ stats()!.activeEmployees }}</span>
        </div>
        <div class="card stat">
          <span class="label">Inactive</span>
          <span class="value inactive">{{ stats()!.inactiveEmployees }}</span>
        </div>
        <div class="card stat">
          <span class="label">Departments</span>
          <span class="value">{{ stats()!.totalDepartments }}</span>
        </div>
        <div class="card stat">
          <span class="label">Avg. Salary</span>
          <span class="value">{{ stats()!.averageSalary | currency }}</span>
        </div>
      </div>

      <div class="card" style="margin-top:20px;">
        <h3>Employees by Department</h3>
        @for (dept of stats()!.employeesByDepartment; track dept.department) {
          <div class="dept-row">
            <span>{{ dept.department }}</span>
            <div class="bar-wrap">
              <div class="bar" [style.width.%]="(dept.count / stats()!.totalEmployees) * 100"></div>
            </div>
            <span>{{ dept.count }}</span>
          </div>
        }
      </div>
    } @else {
      <p>Loading dashboard...</p>
    }
  `,
  styles: [`
    h1 { margin-bottom: 16px; }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 16px;
    }
    .stat { display: flex; flex-direction: column; gap: 6px; }
    .label { font-size: 13px; color: #6b7280; }
    .value { font-size: 28px; font-weight: 700; }
    .value.active { color: #16a34a; }
    .value.inactive { color: #dc2626; }
    .dept-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .dept-row span:first-child { width: 140px; font-size: 14px; }
    .dept-row span:last-child { width: 30px; text-align: right; font-size: 14px; }
    .bar-wrap { flex: 1; background: #f3f4f6; border-radius: 6px; height: 10px; }
    .bar { background: #2563eb; height: 10px; border-radius: 6px; }
  `]
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getDashboardStats().subscribe((s) => this.stats.set(s));
  }
}
