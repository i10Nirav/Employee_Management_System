import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';
import { Employee } from '../../core/models/models';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="header-row">
      <h1>Employees</h1>
      @if (authService.isAdmin()) {
        <a class="btn btn-primary" routerLink="/employees/new">+ Add Employee</a>
      }
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Status</th>
            @if (authService.isAdmin()) { <th>Actions</th> }
          </tr>
        </thead>
        <tbody>
          @for (emp of employees(); track emp.id) {
            <tr>
              <td>{{ emp.firstName }} {{ emp.lastName }}</td>
              <td>{{ emp.email }}</td>
              <td>{{ emp.department }}</td>
              <td>{{ emp.position }}</td>
              <td>{{ emp.salary | currency }}</td>
              <td>
                <span [class.status-active]="emp.isActive" [class.status-inactive]="!emp.isActive">
                  {{ emp.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              @if (authService.isAdmin()) {
                <td class="actions">
                  <a [routerLink]="['/employees', emp.id]" class="btn btn-secondary">Edit</a>
                  <button class="btn btn-danger" (click)="onDelete(emp.id)">Delete</button>
                </td>
              }
            </tr>
          } @empty {
            <tr><td colspan="7">No employees found.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .actions { display: flex; gap: 8px; }
    .status-active { color: #16a34a; font-weight: 600; }
    .status-inactive { color: #dc2626; font-weight: 600; }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees = signal<Employee[]>([]);

  constructor(private employeeService: EmployeeService, public authService: AuthService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.employeeService.getAll().subscribe((data) => this.employees.set(data));
  }

  onDelete(id: number): void {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    this.employeeService.delete(id).subscribe(() => this.load());
  }
}
