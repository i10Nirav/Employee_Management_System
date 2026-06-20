import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, DashboardStats } from '../models/models';

const API_URL = 'https://localhost:5001/api';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${API_URL}/employees`);
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${API_URL}/employees/${id}`);
  }

  create(employee: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(`${API_URL}/employees`, employee);
  }

  update(id: number, employee: Partial<Employee>): Observable<void> {
    return this.http.put<void>(`${API_URL}/employees/${id}`, employee);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/employees/${id}`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${API_URL}/dashboard/stats`);
  }
}
