const db = require('./db');

// lets add comments to the code
// this is a class that will be used to query the database
class DBQuery {
    // this is a function that will be used to view all departments
    async viewAllDepartments() {
        const result = await db.query('SELECT * FROM department');
        return result;
    }

    // this is a function that will be used to view all roles
    viewAllRoles() {
        return db.query(`
            SELECT 
                role.id, 
                role.title, 
                department.name AS department, 
                role.salary
            FROM 
                role
                INNER JOIN department ON role.department_id = department.id
        `);
    }

    // this is a function that will be used to view all employees
    viewAllEmployees() {
        return db.query(`
            SELECT 
                e.id, 
                e.first_name, 
                e.last_name, 
                r.title, 
                d.name AS department, 
                r.salary,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM 
                employee AS e
                INNER JOIN role AS r ON e.role_id = r.id
                INNER JOIN department AS d ON r.department_id = d.id
                LEFT JOIN employee AS m ON e.manager_id = m.id
        `);
    }

    // this is a function add a new department
    addDepartment(name) {
        return db.query('INSERT INTO department SET ?', { name });
    }

    // this is a function to add a new role
    addRole({ title, salary, department_id }) {
        return db.query('INSERT INTO role SET ?', { title, salary, department_id });
    }

    // this is a function to add a new employee
    addEmployee({ first_name, last_name, role_id, manager_id }) {
        return db.query('INSERT INTO employee SET ?', { first_name, last_name, role_id, manager_id });
    }

    // this is a function to update an employee role
    updateEmployeeRole({ id, role_id }) {
        return db.query('UPDATE employee SET role_id = ? WHERE id = ?', [role_id, id]);
    }

    // this is a function to delete a department
    deleteDepartment(id) {
        return db.query('DELETE FROM department WHERE id = ?', [id]);
    }

    // this is a function to delete a role
    deleteRole(id) {
        return db.query('DELETE FROM role WHERE id = ?', [id]);
    }

    // this is a function to delete an employee
    async deleteEmployee(id) {
        try {
            // Check if the employee exists
            const employee = await db.query('SELECT * FROM employee WHERE id = ?', [id]);
        
            if (employee[0].length === 0) {
                console.log("\n", 'Employee not found.', "\n");
                return;
            }
        
            // Check if the employee is a manager
            const isManager = await db.query('SELECT id FROM employee WHERE manager_id = ?', [id]);
        
            if (isManager[0].length > 0) {
                console.log("\n", 'Cannot delete a manager employee.', "\n");
                return;
            }
        
            // Delete the employee
            await db.query('DELETE FROM employee WHERE id = ?', [id]);
            console.log("\n", 'Employee deleted successfully!', "\n");
        } catch (error) {
            console.error("\n", 'Error deleting employee:', error.message);
        }
    }

    // this is a function to update an employee manager
    updateEmployeeManager({ id, manager_id }) {
        return db.query('UPDATE employee SET manager_id = ? WHERE id = ?', [manager_id, id]);
    }

    // this is a function to view the total utilized budget of a department
    getDepartmentBudget(department_id) {
        return db.query('SELECT SUM(role.salary) AS budget FROM employee INNER JOIN role ON employee.role_id = role.id WHERE role.department_id = ?', [department_id])
            .then(result => result[0][0].budget);
    }

    // this is a function to view employees by manager
    viewEmployeesByManager(managerId) {
        return db.query(`
            SELECT
                e.id,
                e.first_name,
                e.last_name,
                r.title,
                d.name AS department,
                r.salary
            FROM
                employee AS e
                INNER JOIN role AS r ON e.role_id = r.id
                INNER JOIN department AS d ON r.department_id = d.id
            WHERE
                e.manager_id = ?
        `, [managerId]);
    }

    // this is a function to view employees by department
    viewEmployeesByDepartment(departmentId) {
        return db.query(`
            SELECT
                e.id,
                e.first_name,
                e.last_name,
                r.title,
                d.name AS department,
                r.salary
            FROM
                employee AS e
                INNER JOIN role AS r ON e.role_id = r.id
                INNER JOIN department AS d ON r.department_id = d.id
            WHERE
                d.id = ?
        `, [departmentId]);
    }

    // this is a function to get the a list of department to choose from
    async getDepartmentChoices() {
        // Get all departments from the database
        const departments = await this.viewAllDepartments();

        // Format departments into an array of choices for inquirer
        const departmentChoices = departments[0].map(department => {
            return {
                name: department.name,
                value: department.id
            };
        });

        return departmentChoices;
    }

    // this is a function to get a list of roles to choose from
    async getRoleChoices() {
        // Get all roles from the database
        const roles = await this.viewAllRoles();
    
        // Format roles into an array of choices for inquirer
        const roleChoices = roles[0].map(role => {
            return {
                name: role.title,
                value: role.id
            };
        });
    
        return roleChoices;
    }

    // this is a function to get a list of employees to choose from
    async getEmployeeChoices() {
        // Get all employees from the database
        const employees = await this.viewAllEmployees();
    
        // Format employees into an array of choices for inquirer
        const employeeChoices = employees[0].map(employee => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            };
        });
    
        // Add an additional option for "None"
        employeeChoices.push({name: "None", value: null});
    
        return employeeChoices;
    }
    
}

module.exports = new DBQuery();