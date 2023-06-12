const inquirer = require('inquirer');
const DBQuery = require('./queries');
require('console.table');

// show the employee tracker name
function showEmployeeTrackerConsole() {
    console.log(`
        +--------------------------------------------------+
        |  ______                 _                        |
        | |  ____|               | |                       |
        | | |__   _ __ ___  _ __ | | ___  _   _  ___  ___  |
        | |  __| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\ |
        | | |____| | | | | | |_) | | (_) | |_| |  __/  __/ |
        | |______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___| |
        | |__   __|        | || |          __/ |           |
        |    | |_ __ __ _  |_|| | _____ _ |___/            |
        |    | | '__/ _\` |/ __| |/ / _ \\ '__|              |
        |    | | | | (_| | (__|   <  __/ |                 |
        |    |_|_|  \\__,_|\\___|_|\\_\\___|_|                 |
        |                                                  |
        +--------------------------------------------------+
    `);
}

// main application loop
async function startEmployeeTracker() {

    // show the employee tracker name
    showEmployeeTrackerConsole();

    let isRunning = true;

    while (isRunning) {
        // prompt the user for what they would like to do
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'View employees by manager',
                'View employees by department',
                'View department budget',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update an employee manager',
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'Exit'
            ]
        });

        // call the appropriate function depending on what the user chose
        switch (action) {
            // View all departments
            case 'View all departments':
                const departments = await DBQuery.viewAllDepartments();
                console.table("\n", departments[0]);  // Format the result as a table
                break;
            // View all roles
            case 'View all roles':
                const roles = await DBQuery.viewAllRoles();
                console.table("\n", roles[0]);
                break;
            // View all employees
            case 'View all employees':
                const employees = await DBQuery.viewAllEmployees();
                console.table("\n", employees[0]);
                break;
            // Add a department
            case 'Add a department':
                const { name } = await inquirer.prompt({
                    type: 'input',
                    name: 'name',
                    message: 'Enter the name of the department'
                });
                await DBQuery.addDepartment(name);
                console.log("\n", 'Department added successfully!', "\n");
                break;
            // Add a role
            case 'Add a role':
                const roleInfo = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Enter the role title'
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Enter the salary for this role'
                    },
                    {
                        type: 'list',
                        name: 'department_id',
                        message: 'Select the department for this role',
                        choices: await DBQuery.getDepartmentChoices()
                    }
                ]);
                await DBQuery.addRole(roleInfo);
                console.log("\n", 'Role added successfully!', "\n");
                break;
            // Add an employee
            case 'Add an employee':
                const employeeInfo = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'Enter the employee first name'
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'Enter the employee last name'
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'Select the role for this employee',
                        choices: await DBQuery.getRoleChoices()
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: 'Select the manager for this employee (Leave blank for no manager)',
                        choices: await DBQuery.getEmployeeChoices()
                    }
                ]);
                if (employeeInfo.manager_id == -1) employeeInfo.manager_id = null;
                await DBQuery.addEmployee(employeeInfo);
                console.log("\n", 'Employee added successfully!', "\n");
                break;
            // Update an employee role
            case 'Update an employee role':
                const updateInfo = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'id',
                        message: "Which employee's role would you like to update?",
                        choices: await DBQuery.getEmployeeChoices()
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'Select the new role for this employee',
                        choices: await DBQuery.getRoleChoices()
                    }
                ]);
                await DBQuery.updateEmployeeRole(updateInfo);
                console.log("\n", 'Employee role updated successfully!', "\n");
                break;
            // Update an employee manager   
            case 'Update an employee manager':
                const updateManagerInfo = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'id',
                        message: "Which employee's manager would you like to update?",
                        choices: await DBQuery.getEmployeeChoices()
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: 'Select the new manager for this employee',
                        choices: await DBQuery.getEmployeeChoices()
                    }
                ]);
                await DBQuery.updateEmployeeManager(updateManagerInfo);
                console.log("\n", 'Employee manager updated successfully!', "\n");
                break;
            // Delete an department
            case 'Delete a department':
                const departmentToDelete = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'id',
                        message: "Which department would you like to delete?",
                        choices: await DBQuery.getDepartmentChoices()
                    }
                ]);
                await DBQuery.deleteDepartment(departmentToDelete.id);
                console.log("\n", 'Department deleted successfully!', "\n");
                break;
            // View employees by manager
            case 'View employees by manager':
                const managerId = await inquirer.prompt({
                    type: 'list',
                    name: 'managerId',
                    message: 'Select a manager to view their employees:',
                    choices: await DBQuery.getEmployeeChoices()
                });
                const employeesByManager = await DBQuery.viewEmployeesByManager(managerId.managerId);
                console.table("\n", employeesByManager[0]);
                break;
            // View employees by department
            case 'View employees by department':
                const departmentId = await inquirer.prompt({
                    type: 'list',
                    name: 'departmentId',
                    message: 'Select a department to view its employees:',
                    choices: await DBQuery.getDepartmentChoices()
                });
                const employeesByDepartment = await DBQuery.viewEmployeesByDepartment(departmentId.departmentId);
                console.table("\n", employeesByDepartment[0]);
                break;
            // Delete a role
            case 'Delete a role':
                const roleToDelete = await inquirer.prompt([
                    {
                    type: 'list',
                    name: 'id',
                    message: 'Which role would you like to delete?',
                    choices: await DBQuery.getRoleChoices()
                    }
                ]);
                await DBQuery.deleteRole(roleToDelete.id);
                console.log("\n", 'Role deleted successfully!', "\n");
                break;
            // Delete an employee
            case 'Delete an employee':
                const employeeToDelete = await inquirer.prompt([
                    {
                    type: 'list',
                    name: 'id',
                    message: "Which employee would you like to delete?",
                    choices: await DBQuery.getEmployeeChoices()
                    }
                ]);
                await DBQuery.deleteEmployee(employeeToDelete.id);
                break;
            // View by department budget
            case 'View department budget':
                const departmentBudget = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department_id',
                        message: 'Select the department to view the budget:',
                        choices: await DBQuery.getDepartmentChoices()
                    }
                ]);
                const budget = await DBQuery.getDepartmentBudget(departmentBudget.department_id);
                console.log("\n", `Total Utilized Budget for Department: $${budget}`, "\n");
                break;
            // Exit the program
            case 'Exit':
                console.log('Exiting the Employee Tracker...');
                process.exit();
        }
    }
}

startEmployeeTracker().catch(console.error);