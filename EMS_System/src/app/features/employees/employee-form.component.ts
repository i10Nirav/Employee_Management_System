import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/models';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>{{ isEdit() ? 'Edit Employee' : 'Add Employee' }}</h1>

    <form class="card form-grid" (ngSubmit)="onSubmit()">
      <div>
        <label>First Name</label>
        <input type="text" name="firstName" [(ngModel)]="model.firstName" required />
      </div>
      <div>
        <label>Last Name</label>
        <input type="text" name="lastName" [(ngModel)]="model.lastName" required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" [(ngModel)]="model.email" required />
      </div>
      <div>
        <label>Phone</label>
        <input type="text" name="phone" [(ngModel)]="model.phone" />
      </div>
      <div>
        <label>Department</label>
        <input type="text" name="department" [(ngModel)]="model.department" required />
      </div>
      <div>
        <label>Position</label>
        <input type="text" name="position" [(ngModel)]="model.position" required />
      </div>
      <div>
        <label>Salary</label>
        <input type="number" name="salary" [(ngModel)]="model.salary" required />
      </div>
      <div>
        <label>Hire Date</label>
        <input type="date" name="hireDate" [(ngModel)]="hireDateStr" required />
      </div>
      <div class="checkbox-row">
        <label><input type="checkbox" name="isActive" [(ngModel)]="model.isActive" /> Active</label>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-secondary" (click)="router.navigate(['/employees'])">Cancel</button>
      </div>
    </form>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      max-width: 640px;
    }
    label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px; }
    .checkbox-row { display: flex; align-items: center; }
    .checkbox-row label { display: flex; align-items: center; gap: 6px; font-weight: 400; }
    .form-actions { grid-column: span 2; display: flex; gap: 10px; margin-top: 10px; }
  `]
})
export class EmployeeFormComponent implements OnInit {
  model: Partial<Employee> = {
    firstName: '', lastName: '', email: '', phone: '',
    department: '', position: '', salary: 0, isActive: true
  };
  hireDateStr = '';
  isEdit = signal(false);
  employeeId: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEdit.set(true);
      this.employeeId = Number(idParam);
      this.employeeService.getById(this.employeeId).subscribe((emp) => {
        this.model = emp;
        this.hireDateStr = emp.hireDate?.substring(0, 10) ?? '';
      });
    } else {
      this.hireDateStr = new Date().toISOString().substring(0, 10);
    }
  }

  onSubmit(): void {
    const payload = { ...this.model, hireDate: this.hireDateStr };

    if (this.isEdit() && this.employeeId) {
      this.employeeService.update(this.employeeId, payload).subscribe(() => {
        this.router.navigate(['/employees']);
      });
    } else {
      this.employeeService.create(payload).subscribe(() => {
        this.router.navigate(['/employees']);
      });
    }
  }
}
