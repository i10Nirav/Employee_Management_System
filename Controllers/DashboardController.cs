using EmployeeManagementAPI.Data;
using EmployeeManagementAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _db;

        public DashboardController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetStats()
        {
            var employees = await _db.Employees.ToListAsync();

            var stats = new DashboardStatsDto
            {
                TotalEmployees = employees.Count,
                ActiveEmployees = employees.Count(e => e.IsActive),
                InactiveEmployees = employees.Count(e => !e.IsActive),
                TotalDepartments = employees.Select(e => e.Department).Distinct().Count(),
                AverageSalary = employees.Count > 0 ? Math.Round(employees.Average(e => e.Salary), 2) : 0,
                EmployeesByDepartment = employees
                    .GroupBy(e => e.Department)
                    .Select(g => new DepartmentCountDto { Department = g.Key, Count = g.Count() })
                    .OrderByDescending(d => d.Count)
                    .ToList()
            };

            return Ok(stats);
        }
    }
}
