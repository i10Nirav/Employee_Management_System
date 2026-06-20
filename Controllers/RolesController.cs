using EmployeeManagementAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class RolesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public RolesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var roles = await _db.Roles
                .Select(r => new { r.Id, r.Name, UserCount = r.Users!.Count })
                .ToListAsync();

            return Ok(roles);
        }

        [HttpGet("users")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _db.Users
                .Include(u => u.Role)
                .Select(u => new { u.Id, u.Username, u.Email, Role = u.Role!.Name })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPut("users/{userId}/role/{roleId}")]
        public async Task<ActionResult> AssignRole(int userId, int roleId)
        {
            var user = await _db.Users.FindAsync(userId);
            var role = await _db.Roles.FindAsync(roleId);

            if (user == null || role == null) return NotFound();

            user.RoleId = roleId;
            await _db.SaveChangesAsync();

            return Ok(new { message = $"User '{user.Username}' assigned to role '{role.Name}'" });
        }
    }
}
