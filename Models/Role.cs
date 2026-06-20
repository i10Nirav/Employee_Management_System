namespace EmployeeManagementAPI.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // "Admin" or "Employee"

        public ICollection<User>? Users { get; set; }
    }
}
